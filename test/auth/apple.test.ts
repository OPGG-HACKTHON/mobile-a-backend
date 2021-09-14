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
import { AppleService } from '../../src/auth/passport/apple-auth.service';
import { SchoolService } from '../../src/school/school.service';

describe('apple oauth test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
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
        AppleService,
        SchoolService,
      ],
    })
      .overrideProvider(GoogleAuthService)
      .useValue(googleAuthService)
      .compile();

    app = moduleRefAuth.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    app.close();
    await prismaService.$disconnect();
  });

  it('apple login test,  /auth/apple test', async () => {
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
        imageUrl: '',
      },
    });
    await prismaService.user.create({
      data: {
        authFrom: 'apple',
        email: 'tpgns7708@naver.com',
        schoolId: '1',
      },
    });

    const expireAtForTest = new Date();
    expireAtForTest.setFullYear(expireAtForTest.getFullYear() + 1);

    const tokenTest = await prismaService.token.create({
      data: {
        token: 'apple_116605817241027933549',
        userId: 1,
        expireAt: expireAtForTest,
      },
    });

    const user = await prismaService.user.findFirst({
      where: {
        authFrom: 'apple',
        email: 'tpgns7708@naver.com',
      },
    });

    const testTime = new Date();
    const { token, userId, expireAt } = tokenTest;
    expect(token).toBe('apple_116605817241027933549');
    expect(userId).toBe(1);
    expect(expireAt.valueOf()).toBeGreaterThan(testTime.valueOf());
  });
});
