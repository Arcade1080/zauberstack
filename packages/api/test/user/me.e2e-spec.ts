import { INestApplication } from '@nestjs/common';
import {
  initTestApp,
  assertOkAndGetData,
  assertNotOkAndGetError,
  authenticateAsAdminUser,
  query,
  initTestAdminUser,
  TEST_ADMIN_USER,
  initHttpAgent,
  initRolesAndPermissions,
  wipeDatabase,
} from '../e2eUtils';
import { PrismaService } from 'nestjs-prisma';

const QUERY_ME = `
    query {
        me{
            id,
            email,
            firstname,
            lastname, 
            createdAt,
            updatedAt,
            role {
              name,
              permissions {
                name
              }
            }
            account {
                id,
            }
        }
    }    
`;

describe('Get current signed in user via GraphQL', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await initTestApp();
    prismaService = app.get<PrismaService>(PrismaService);
    await wipeDatabase(app);
    await initRolesAndPermissions(app);
    await initTestAdminUser(app);
  });

  afterAll(async () => {
    await wipeDatabase(app);
    await prismaService.$disconnect();
    await app.close();
  });

  it('Should return current admin user', async () => {
    const agent = await authenticateAsAdminUser(app);

    const result = await query(agent, {
      query: QUERY_ME,
    });

    const data = assertOkAndGetData(result);

    expect(data.me).toBeDefined();
    expect(data.me.id).toBeDefined();
    expect(data.me.email).toBe(TEST_ADMIN_USER.email);
    expect(data.me.firstname).toBe(TEST_ADMIN_USER.firstname);
    expect(data.me.lastname).toBe(TEST_ADMIN_USER.lastname);
    expect(data.me.password).toBeUndefined();
    expect(data.me.createdAt).toBeDefined();
    expect(data.me.updatedAt).toBeDefined();
    expect(data.me.role).toBeDefined();
    expect(data.me.role.name).toBe(TEST_ADMIN_USER.role);
    expect(data.me.role.permissions).toBeDefined();
    expect(data.me.account.id).toBeDefined();
  });

  test('Should return an unauthorized error', async () => {
    const agent = initHttpAgent(app);
    const result = await query(agent, {
      query: QUERY_ME,
    });

    const errors = assertNotOkAndGetError(result);
    expect(result.data).toBeNull();
    expect(errors[0].extensions.code).toBe('unauthorized');
    expect(errors[0].message).toBe('Unauthorized');
  });
});
