import { initSchema } from '../commn/schemaUtil';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
//
import { LOLService } from '../../src/lol/lol.service';
import { LOLModule } from '../../src/lol/lol.module';
//
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UserService } from '../../src/user/user.service';
import { BattleService } from '../../src/battle/battle.service';
import { BattleModule } from '../../src/battle/battle.module';
import { UserModule } from '../../src/user/user.module';
import { TitleModule } from '../../src/title/title.module';
import { TitleService } from '../../src/title/title.service';
//
describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  const userService = new UserService(prismaService, lolService);
  const battleService = new BattleService(prismaService, userService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule, BattleModule, UserModule, LOLModule, TitleModule],
      providers: [
        PrismaService,
        BattleService,
        UserService,
        LOLService,
        TitleService,
      ],
    })
      .overrideProvider(BattleService)
      .useValue(battleService)
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

  it('search user by lolnickname', async () => {
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
      },
    });

    const resCreated = await userService.createUser({
      authFrom: 'google',
      email: 'abc@abc.com',
      LOLNickName: 'kkangsan',
      schoolId: '1',
    });

    const res = await request(app.getHttpServer())
      .get('/battles/search/kkang')
      .set('Accept', 'application/json')
      .type('application/json');

    expect(res.body.length).toBe(1); // kkangsan
    expect(res.body[0].id).toBe(1); // kkangsan
    const { lol } = res.body[0];
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
