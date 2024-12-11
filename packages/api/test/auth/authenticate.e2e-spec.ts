import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  TEST_ADMIN_USER,
  assertNotOkAndGetError,
  assertOkAndGetData,
  initHttpAgent,
  initRolesAndPermissions,
  initTestAdminUser,
  initTestApp,
  query,
  wipeDatabase,
} from '../e2eUtils';

const QUERY_AUTHENTICATE = `
    mutation signIn($data: SignInInput!){
      signIn(data: $data) {
            accessToken
        }
    }
`;

describe('Login user with valid and invalid credentials', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await initTestApp();
    prismaService = app.get<PrismaService>(PrismaService);
    await wipeDatabase(app);
    await initRolesAndPermissions(app);
  });

  afterAll(async () => {
    await wipeDatabase(app);
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.account.deleteMany();
    await initTestAdminUser(app);
  });

  test('Valid login should return access token', async () => {
    const httpAgent = initHttpAgent(app);

    const result: any = await query(httpAgent, {
      query: QUERY_AUTHENTICATE,
      variables: {
        data: {
          email: TEST_ADMIN_USER.email,
          password: TEST_ADMIN_USER.password,
        },
      },
    });

    const data = assertOkAndGetData(result);
    expect(data.signIn).toBeDefined();
    expect(data.signIn.accessToken).toBeDefined();
  });

  test('Invalid password should return an invalid credentials error', async () => {
    const agent = initHttpAgent(app);
    const result: any = await query(
      agent,
      {
        query: QUERY_AUTHENTICATE,
        variables: {
          data: {
            email: TEST_ADMIN_USER.email,
            password: 'false password',
          },
        },
      },
      true,
    );

    const errors = assertNotOkAndGetError(result);
    expect(result.data).toBeNull();
    expect(errors[0].extensions.code).toBe('auth_invalid_credentials');
    expect(errors[0].message).toBe('The given credentials are invalid');
  });

  test('Invalid email should return an invalid credentials error', async () => {
    const agent = initHttpAgent(app);
    const result: any = await query(agent, {
      query: QUERY_AUTHENTICATE,
      variables: {
        data: {
          email: 'wrongemail@test.de',
          password: TEST_ADMIN_USER.password,
        },
      },
    });

    const errors = assertNotOkAndGetError(result);
    expect(result.data).toBeNull();
    expect(errors[0].extensions.code).toBe('auth_invalid_credentials');
    expect(errors[0].message).toBe('The given credentials are invalid');
  });
});
