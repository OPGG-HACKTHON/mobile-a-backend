import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LOLService } from '../../src/lol/lol.service';
import { UserService } from '../../src/user/user.service';
import { GoogleAuthService } from '../../src/auth/passport/google-auth.service';
import { LOLModule } from '../../src/lol/lol.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UserModule } from '../../src/user/user.module';

describe('google oauth test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const userService = new UserService(prismaService);
  const lolService = new LOLService(prismaService);
  const googleAuthService = new GoogleAuthService();
  beforeAll(async () => {
    await initSchema(prismaService);
    const moduleRefAuth = await Test.createTestingModule({
      imports: [UserModule, PrismaModule, LOLModule, AuthModule],
      providers: [
        UserService,
        PrismaService,
        LOLService,
        AuthService,
        GoogleAuthService,
      ],
    })
      .overrideProvider(GoogleAuthService)
      .useValue(googleAuthService)
      .compile();

    app = moduleRefAuth.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
    prismaService.$disconnect();
  });

  it('google login test,  /auth/google test', async () => {
    await prismaService.region.create({
      data: {
        name: '서울',
      },
    });
    await prismaService.school.create({
      data: {
        id: '1',
        name: '가나다초등학교',
        division: '초딩',
        educationOffice: '교육청',
        regionId: 1,
        address: '어디선가',
      },
    });
    await prismaService.user.create({
      data: {
        authFrom: 'google',
        email: 'tpgns7708@gmail.com',
        schoolId: '1',
      },
    });

    const res = await request(app.getHttpServer())
      .get('/auth/google')
      .set('Accept', 'application/json')
      .type('application/json');

    const user = await prismaService.user.findFirst({
      where: {
        authFrom: 'google',
        email: 'tpgns7708@gmail.com',
      },
    });

    const userToken = await prismaService.token.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    expect(res.statusCode).toBe(302);
    // const { Token, expireAt } = userToken;
    // expect(Token).toBeTruthy();
    // expect(expireAt).toBeGreaterThanOrEqual(Date.now());
  });
});
