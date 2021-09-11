import { initSchema } from '../commn/schemaUtil';
import { UserModule } from '../../src/user/user.module';
import { UserService } from '../../src/user/user.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
//
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { LOLService } from '../../src/lol/lol.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { LOLModule } from '../../src/lol/lol.module';
import { GoogleAuthService } from '../../src/auth/passport/google-auth.service';
import { TitleModule } from '../../src/title/title.module';
import { TitleService } from '../../src/title/title.service';

describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  const userService = new UserService(prismaService, lolService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, AuthModule, PrismaModule, LOLModule, TitleModule],
      providers: [
        UserService,
        AuthService,
        PrismaService,
        LOLService,
        GoogleAuthService,
        TitleService,
      ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  // same auth test
  it('create school,lolaccount,  /auth/signup test and get profile', async () => {
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

    // mock data
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
    // find profile
    const resProfile = await request(app.getHttpServer())
      .get('/users/1/profile')
      .set('Accept', 'application/json')
      .type('application/json');
    expect(resProfile.body.id).toBe(1);
    const {
      profileIconId,
      profileIconImageUrl,
      summonerLevel,
      tierInfo,
      name,
    } = resProfile.body.lol;
    expect(name).toBeTruthy();
    expect(profileIconId).toBeTruthy();
    expect(profileIconImageUrl).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
    const { tier, rank, leaguePoints } = tierInfo;
    expect(tier).toBeTruthy();
    expect(rank).toBeTruthy();
    expect(leaguePoints >= 0).toBeTruthy();
  });
});
