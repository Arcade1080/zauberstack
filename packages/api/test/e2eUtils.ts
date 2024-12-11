import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { GraphQLFormattedError } from 'graphql';
import { PrismaService } from 'nestjs-prisma';
import * as supertest from 'supertest';
import { SuperAgentTest } from 'supertest';
import { AppModule } from '../src/app/app.module';
import { PasswordService } from '../src/auth/password.service';

export const ROLES = ['admin', 'author'];

export const PERMISSIONS = {
  admin: [
    'manage-organization',
    'manage-subscriptions',
    'create-tags',
    'read-tags',
    'update-tags',
    'delete-tags',
    'create-tasks',
    'read-tasks',
    'update-tasks',
    'delete-tasks',
    'edit-users',
    'invite-users',
    'edit-account',
    'delete-account',
  ],
  author: [
    'create-tags',
    'read-tags',
    'update-tags',
    'delete-tags',
    'create-tasks',
    'read-tasks',
    'update-tasks',
    'delete-tasks',
  ],
};

export const TEST_ADMIN_USER = {
  firstname: 'Bart',
  lastname: 'Simpson',
  role: 'admin',
  email: 'standard@user.com',
  password: 'secret100',
};

const QUERY_AUTHENTICATE = `
    mutation SignIn($data: SignInInput!){
        signIn(data: $data) {
            accessToken
        }
    }
`;

export async function initTestApp(): Promise<INestApplication> {
  // Create module
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [PrismaService],
  }).compile();

  // Initialize app
  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  return await app.init();
}

export async function wipeDatabase(app: INestApplication): Promise<void> {
  const prismaService = app.get<PrismaService>(PrismaService);
  await prismaService.user.deleteMany();
  await prismaService.account.deleteMany();
  await prismaService.permission.deleteMany();
  await prismaService.organization.deleteMany();
  await prismaService.role.deleteMany();
}

export async function initRolesAndPermissions(
  app: INestApplication,
): Promise<void> {
  const prismaService = app.get<PrismaService>(PrismaService);

  for (const roleName of ROLES) {
    await prismaService.role.create({
      data: {
        name: roleName,
        permissions: {
          create: PERMISSIONS[roleName].map((permission) => ({
            name: permission,
          })),
        },
      },
    });
  }
}

export async function initTestAdminUser(app: INestApplication): Promise<void> {
  const prismaService = app.get<PrismaService>(PrismaService);
  const passwordService = app.get<PasswordService>(PasswordService);

  const hashedPassword = await passwordService.hashPassword(
    TEST_ADMIN_USER.password,
  );

  const Account = await prismaService.account.create({
    data: {
      organization: {
        create: {
          name: 'Admin United',
          line1: 'Fake Street',
          line2: '123',
          zip: '45655',
          city: 'Springfield',
          country: 'USA',
        },
      },
    },
  });

  const adminRole = await prismaService.role.findUnique({
    where: { name: 'admin' },
  });

  await prismaService.user.create({
    data: {
      firstname: TEST_ADMIN_USER.firstname,
      lastname: TEST_ADMIN_USER.lastname,
      email: TEST_ADMIN_USER.email,
      password: hashedPassword,
      status: 'ACTIVE',
      role: {
        connect: {
          id: adminRole?.id,
        },
      },
      account: {
        connect: {
          id: Account.id,
        },
      },
    },
  });
}

export type GraphQlResponse = {
  data?: Record<string, any> | null;
  errors?: ReadonlyArray<GraphQLFormattedError>;
  extensions?: Record<string, any>;
};

export const initHttpAgent = (app: INestApplication) => {
  return supertest.agent(app.getHttpServer());
};

const fetchQueryResult = async (
  agent: SuperAgentTest,
  requestBody,
): Promise<supertest.Response> => {
  return agent
    .post('/graphql')
    .send(requestBody)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
};

export const query = async (
  agent: any,
  requestBody: Record<string, unknown>,
  ignoreStatus = false,
): Promise<GraphQlResponse> => {
  const response = await fetchQueryResult(agent, requestBody);
  if (!ignoreStatus) {
    expect(response.status).toBe(200);
  }
  expect(response.body).toBeDefined();
  expect(typeof response.body).toBe('object');
  return response.body;
};

export function assertOkAndGetData(
  result: GraphQlResponse,
): Record<string, any> | null {
  expect(result).toBeDefined();
  if (result.errors) {
    fail(result.errors);
  }
  expect(result.data).toBeDefined();

  return result.data;
}

export function assertNotOkAndGetError(
  result: GraphQlResponse,
): ReadonlyArray<GraphQLFormattedError> {
  expect(result).toBeDefined();
  expect(result.errors).toBeDefined();
  expect(result.errors.length).toBeGreaterThanOrEqual(1);

  return result.errors;
}

export async function authenticate(
  app: INestApplication,
  user: any,
  password: string,
): Promise<any> {
  const agent = initHttpAgent(app);

  const result = await agent
    .post('/graphql')
    .send({
      query: QUERY_AUTHENTICATE,
      variables: {
        data: {
          email: user.email,
          password: password,
        },
      },
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('set-cookie', /refresh_token/);

  agent.set('Authorization', `Bearer ${result.body.data.signIn.accessToken}`);

  return agent;
}

export async function authenticateAsAdminUser(
  app: INestApplication,
): Promise<SuperAgentTest> {
  return await authenticate(app, TEST_ADMIN_USER, TEST_ADMIN_USER.password);
}
