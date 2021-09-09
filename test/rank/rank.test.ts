import { initSchema } from '../commn/schemaUtil';
import { RankModule } from '../../src/rank//rank.module';
import { RankService } from '../../src/rank/rank.service';
import { UserService } from '../../src/user/user.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserModule } from '../../src/user/user.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
//
import { LOLService } from '../../src/lol/lol.service';
import { LOLModule } from '../../src/lol/lol.module';
//
import { AuthService } from '../../src/auth/auth.service';
import { AuthModule } from '../../src/auth/auth.module';
import { GoogleAuthService } from '../../src/auth/passport/google-auth.service';
import { AppleService } from '../../src/auth/passport/apple-auth.service';

describe('simple etst', () => {
  let app: INestApplication;

  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  const userService = new UserService(prismaService, lolService);
  const rankService = new RankService(prismaService, userService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRefAuth = await Test.createTestingModule({
      imports: [RankModule, UserModule, PrismaModule, LOLModule, AuthModule],
      providers: [
        UserService,
        RankService,
        PrismaService,
        LOLService,
        AuthService,
        GoogleAuthService,
        AppleService,
      ],
    })
      .overrideProvider(RankService)
      .useValue(rankService)
      .compile();

    app = moduleRefAuth.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('school profileRanks test', async () => {
    // setup
    // school - foo
    await prismaService.region.create({
      data: {
        name: '서울',
      },
    });
    await prismaService.school.create({
      data: {
        id: '1',
        name: 'foo',
        division: 'foo',
        educationOffice: '교육청이름',
        regionId: 1,
        address: 'foo',
      },
    });
    // setup Title
    await prismaService.lOLSummaryElement.create({
      data: {
        LOLMatchFieldName: '티어',
        calculateType: 'foo',
        sortType: 'desc',
        exposureName: 'foo',
      },
    });
    const res = await userService.createUser({
      authFrom: 'google',
      email: 'abc1@abc.com',
      LOLNickName: 'kkangsan',
      schoolId: '1',
    });
    const { id, email, LOLAccountId, schoolId } = res;
    expect(id).toBe(1);
    expect(email).toBe('abc1@abc.com');
    expect(LOLAccountId).toBeTruthy();
    expect(schoolId).toBe('1');

    const resSignUp2 = await userService.createUser({
      authFrom: 'google',
      email: 'abc2@abc.com',
      LOLNickName: 'hide on bush',
      schoolId: '1',
    });

    expect(resSignUp2.id).toBe(2);
    expect(resSignUp2.email).toBe('abc2@abc.com');
    expect(resSignUp2.LOLAccountId).toBeTruthy();
    expect(resSignUp2.schoolId).toBe('1');

    //e2e;
    const resRankSchool = await request(app.getHttpServer())
      .get(encodeURI('/ranks/schools/1'))
      .set('Accept', 'application/json')
      .type('application/json');

    expect(resRankSchool.body.length).toBe(2);
    expect(resRankSchool.body[0].id).toBe(2); // hide on bush
    expect(resRankSchool.body[0].rankNo).toBe(1); // hide on bush
    expect(resRankSchool.body[0].rankChangedStatus).toBe('NEW'); // hide on bush

    expect(resRankSchool.body[1].id).toBe(1); // kkangsan
    expect(resRankSchool.body[1].rankNo).toBe(2); // kkangsan
    // todo - next day ? test?
    // expect(resRankSchool.body[1].rankChangedStatus).toBe('DOWN'); // hide on bush
    expect(resRankSchool.body[1].rankChangedStatus).toBe('NEW'); // hide on bush

    const { lol } = resRankSchool.body[0];
    expect(resRankSchool.body[0].id).toBeTruthy();
    const { profileIconId, profileIconImageUrl, summonerLevel, tierInfo } = lol;
    expect(profileIconId).toBeTruthy();
    expect(profileIconImageUrl).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
    const { tier, rank, leaguePoints } = tierInfo;
    expect(tier).toBeTruthy();
    expect(rank).toBeTruthy();
    expect(leaguePoints >= 0).toBeTruthy();
  });

  it('school profileRank with schoolId and userId test', async () => {
    // setup
    // school - foo
    await prismaService.region.create({
      data: {
        name: '서울',
      },
    });
    await prismaService.school.create({
      data: {
        id: '1',
        name: 'foo',
        division: 'foo',
        educationOffice: '교육청이름',
        regionId: 1,
        address: 'foo',
      },
    });
    // setup Title
    await prismaService.lOLSummaryElement.create({
      data: {
        LOLMatchFieldName: '티어',
        calculateType: 'foo',
        sortType: 'desc',
        exposureName: 'foo',
      },
    });

    const res = await userService.createUser({
      authFrom: 'google',
      email: 'abc1@abc.com',
      LOLNickName: 'kkangsan',
      schoolId: '1',
    });

    const { id, email, LOLAccountId, schoolId } = res;
    expect(id).toBe(1);
    expect(email).toBe('abc1@abc.com');
    expect(LOLAccountId).toBeTruthy();
    expect(schoolId).toBe('1');

    const resSignUp2 = await userService.createUser({
      authFrom: 'google',
      email: 'abc2@abc.com',
      LOLNickName: 'hide on bush',
      schoolId: '1',
    });

    expect(resSignUp2.id).toBe(2);
    expect(resSignUp2.email).toBe('abc2@abc.com');
    expect(resSignUp2.LOLAccountId).toBeTruthy();
    expect(resSignUp2.schoolId).toBe('1');

    //e2e;
    const resRankSchool = await request(app.getHttpServer())
      .get(encodeURI('/ranks/schools/1/users/1'))
      .set('Accept', 'application/json')
      .type('application/json');

    expect(resRankSchool.body.id).toBe(1); // kkangsan
    expect(resRankSchool.body.rankNo).toBe(2); // kkangsan

    const { lol } = resRankSchool.body;
    expect(resRankSchool.body.id).toBeTruthy();
    const { profileIconId, profileIconImageUrl, summonerLevel, tierInfo } = lol;
    expect(profileIconId).toBeTruthy();
    expect(profileIconImageUrl).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
    const { tier, rank, leaguePoints } = tierInfo;
    expect(tier).toBeTruthy();
    expect(rank).toBeTruthy();
    expect(leaguePoints >= 0).toBeTruthy();
  });
});
