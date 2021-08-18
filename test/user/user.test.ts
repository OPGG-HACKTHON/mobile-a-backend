import { initSchema } from '../commn/schemaUtil';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserService } from '../../src/user/user.service';
import { UserModule } from '../../src/user/user.module';

describe('user test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const userService = new UserService(prismaService);
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
    prismaService.$disconnect();
  });

  beforeEach(async () => {
    await initSchema(prismaService);
  });

  it('GET /user Test', async () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });
});
