import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LOLService } from '../../src/lol/lol.service';
//
import { TitleService } from '../../src/title/title.service';
import { TitleModule } from '../../src/title/title.module';

describe('simple etst', () => {
  let app: INestApplication;
  let appTitle: INestApplication;

  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  const authService = new AuthService(prismaService, lolService);

  // for title
  const titleService = new TitleService(prismaService);
  beforeAll(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const moduleRefTitle = await Test.createTestingModule({
      imports: [TitleModule],
    })
      .overrideProvider(TitleService)
      .useValue(titleService)
      .compile();

    appTitle = moduleRefTitle.createNestApplication();
    await appTitle.init();
  });

  afterAll(() => {
    app.close();
    appTitle.close();
    prismaService.$disconnect();
  });

  it('create school,lolaccount,  /auth/signup test', async () => {
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
