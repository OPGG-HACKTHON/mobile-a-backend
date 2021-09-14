import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';

import request from 'supertest';
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
import { UserService } from '../../src/user/user.service';
import { GoogleAuthService } from '../../src/auth/passport/google-auth.service';
import { AppleService } from '../../src/auth/passport/apple-auth.service';
import { SchoolService } from '../../src/school/school.service';
//
describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const googleAuthService = new GoogleAuthService();
  const appleService = new AppleService();
  const lolService = new LOLService(prismaService);
  const schoolService = new SchoolService(prismaService, lolService);
  const userService = new UserService(prismaService, lolService, schoolService);
  const authService = new AuthService(
    prismaService,
    userService,
    googleAuthService,
    appleService,
    lolService,
  );
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

  beforeAll(async () => {
    await prismaService.$disconnect();
  });

  it('not invalidate authfrom', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({
        authFrom: 'notInvalidAuthFrom',
        email: 'abc@abc.com',
        LOLNickName: 'kkangsan',
        schoolId: '1',
        accesstoken: 'foo',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('유효하지 않은 가입 경로 입니다.');
    expect(res.body.status).toBe(400);
  });

  it('createUserToken and getUserByToken', async () => {
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
        educationOffice: '서울시교육청',
        regionId: 1,
        address: '어디선가',
        imageUrl: '',
      },
    });

    await prismaService.lOLAccount.create({
      data: {
        id: '65c_hOoDrNNWLfWaPgtudAr15hBpQoeYuQjzf195cUvl5w',
        accountId: 'U57EDkh62tbK9Qit4xy85K7sCAe3EDLVeyEUc3902gdR',
        puuid:
          'PvRocf7pG6jnpKC0aKugs4c-0joi8pUUsV2RKNCjN2fOICtfFqqcRXa9tMTwmmGhJvbnPo2H0nN99A',
        name: 'KkangSan',
        profileIconId: 29,
        summonerLevel: 148,
      },
    });
    await prismaService.lOLTier.create({
      data: {
        tier: 'foo',
        rank: 'foo',
        leaguePoints: 1234,
        wins: 1234,
        losses: 1234,
        LOLAccountId: '65c_hOoDrNNWLfWaPgtudAr15hBpQoeYuQjzf195cUvl5w',
      },
    });
    await prismaService.user.create({
      data: {
        authFrom: 'google',
        email: 'abc@abc.com',
        LOLAccountId: '65c_hOoDrNNWLfWaPgtudAr15hBpQoeYuQjzf195cUvl5w',
        schoolId: '1',
      },
    });

    const token = await authService.createToken(1, 'google', 'foo-token');

    expect(token.token).toBe('google_foo-token');
    expect(token.userId).toBe(1);

    //
    const profileWithSchool = await authService.getUserByToken(
      'google_foo-token',
    );
    expect(profileWithSchool.id).toBe(1);
    expect(profileWithSchool.lol.name).toBe('KkangSan');
    expect(profileWithSchool.school.id).toBe('1');
  });
});
