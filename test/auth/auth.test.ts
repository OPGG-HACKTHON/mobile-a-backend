import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
//
import { LOLService } from '../../src/lol/lol.service';
import { LOLModule } from '../../src/lol/lol.module';
//
import { TitleService } from '../../src/title/title.service';
import { TitleModule } from '../../src/title/title.module';
//
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
//
describe('simple etst', () => {
  let app: INestApplication;

  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  const authService = new AuthService(prismaService, lolService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, TitleModule, PrismaModule, LOLModule],
      providers: [AuthService, TitleService, PrismaService, LOLService],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  beforeAll(() => {
    prismaService.$disconnect();
  });

  it('create school,lolaccount /auth/signup test', async () => {
    await prismaService.school.create({
      data: {
        name: '가나다초등학교',
        division: '초딩',
        region: '서울',
        address: '어디선가',
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({ email: 'abc@abc.com', LOLNickName: 'kkangsan', schoolId: 1 });

    expect(res.statusCode).toBe(201);
    const { id, email, LOLAccountId, schoolId } = res.body;
    expect(id).toBe(1);
    expect(email).toBe('abc@abc.com');
    expect(LOLAccountId).toBeTruthy();
    expect(schoolId).toBe(1);
  });
  it('create school,lolaccount  - with lol  /auth/signup test', async () => {
    await prismaService.school.create({
      data: {
        name: '가나다초등학교',
        division: '초딩',
        region: '서울',
        address: '어디선가',
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({ email: 'abc@abc.com', LOLNickName: 'kkangsan', schoolId: 1 });

    expect(res.statusCode).toBe(201);
    const { id, email, LOLAccountId, schoolId } = res.body;
    expect(id).toBe(1);
    expect(email).toBe('abc@abc.com');
    expect(LOLAccountId).toBeTruthy();
    expect(schoolId).toBe(1);
    // after lol info check
    const lolAccount = await prismaService.lOLAccount.findFirst({
      where: {
        id: LOLAccountId,
      },
    });
    expect(lolAccount.name).toBe('KkangSan');
    // Tier
    const lolTier = await prismaService.lOLTier.findFirst({
      where: {
        LOLAccountId: LOLAccountId,
      },
    });
    expect(lolTier).toBeTruthy();
    // check Tier Summary
    const personamTierSummary =
      await prismaService.lOLSummaryPersonal.findFirst({
        where: {
          LOLAccountId: LOLAccountId,
        },
      });
    expect(personamTierSummary).toBeTruthy();
  });
});
