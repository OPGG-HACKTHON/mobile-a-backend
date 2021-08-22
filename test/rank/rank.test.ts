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

describe('simple etst', () => {
  let app: INestApplication;

  const prismaService = new PrismaService();
  const userService = new UserService(prismaService);
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

  afterAll(() => {
    prismaService.$disconnect();
  });

  it('school rank test', async () => {
    // setup
    // school - foo
    await prismaService.school.create({
      data: {
        name: 'foo',
        division: 'foo',
        region: 'foo',
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
    const resSignUp = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({ email: 'abc@abc.com', LOLNickName: 'kkangsan', schoolId: 1 });

    expect(resSignUp.statusCode).toBe(201);
    const { id, email, LOLAccountId, schoolId } = resSignUp.body;
    expect(id).toBe(1);
    expect(email).toBe('abc@abc.com');
    expect(LOLAccountId).toBeTruthy();
    expect(schoolId).toBe(1);
    expect(1).toBe(1);
    //e2e;
    const resRankSchool = await request(app.getHttpServer())
      .get(encodeURI('/ranks/schools/1'))
      .set('Accept', 'application/json')
      .type('application/json');

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
});
