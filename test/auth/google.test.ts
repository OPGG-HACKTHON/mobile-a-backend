import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LOLService } from '../../src/lol/lol.service';
import { TitleService } from '../../src/title/title.service';
import { TitleModule } from '../../src/title/title.module';

describe('google oauth test', () => {
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

  it('google login test,  /auth/google test', async () => {
    await prismaService.school.create({
      data: {
        name: '가나다초등학교',
        division: '초딩',
        region: '서울',
        address: '어디선가',
      },
    });
    await prismaService.user.create({
      data: {
        email: 'tpgns7708@gmail.com',
        schoolId: 1,
      },
    });
    const res = await request(app.getHttpServer())
      .get('/auth/google')
      .set('Accept', 'application/json')
      .type('application/json');

    expect(res.statusCode).toBe(302);
  });
});
