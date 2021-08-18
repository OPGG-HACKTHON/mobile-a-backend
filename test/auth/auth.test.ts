import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const authService = new AuthService(prismaService);
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
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

  it('create school,lolaccount,  /auth/signup test', async () => {
    await prismaService.school.create({
      data: {
        name: '가나다초등학교',
        division: '초딩',
        region: '서울',
      },
    });
    await prismaService.lOLAccount.create({
      data: {
        id: 'foo-id',
        accountId: 'foo-accountId',
        puuid: 'foo-puuid',
        name: 'foo-name',
        profileIconId: '123',
        summonerLevel: 123,
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({ email: 'abc@abc.com', LOLNickName: 'foo-name', schoolId: 1 });
    //
    expect(res.statusCode).toBe(201);
    const { id, email, LOLAccountId, schoolId } = res.body;
    expect(id).toBe(1);
    expect(email).toBe('abc@abc.com');
    expect(LOLAccountId).toBe('foo-id');
    expect(schoolId).toBe(1);
  });
});
