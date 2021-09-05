import { initSchema } from '../commn/schemaUtil';
import { LOLModule } from '../../src/lol/lol.module';
import { LOLService } from '../../src/lol/lol.service';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TitleModule } from '../../src/title/title.module';
import { TitleService } from '../../src/title/title.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [LOLModule, TitleModule, PrismaModule],
      providers: [LOLService, TitleService, PrismaService],
    })
      .overrideProvider(LOLService)
      .useValue(lolService)
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

  it('getSummerInfoByLOLName test and getLOLTierById - success', async () => {
    const { id, accountId, puuid, name, profileIconId, summonerLevel } =
      await lolService.getLOLAccountByLOLName('kkangsan');
    expect(id).toBeTruthy();
    expect(name).toBe('KkangSan'); // 대소문자 구분되서 결과나옴..(kkangsan -> KkangSan)
    expect(accountId).toBeTruthy();
    expect(puuid).toBeTruthy();
    expect(profileIconId).toBeTruthy();
    expect(summonerLevel).toBeTruthy();

    const { tier, rank, leaguePoints, wins, losses } =
      await lolService.getLOLTierByLOLId(id);
    expect(tier).toBeTruthy();
    expect(rank).toBeTruthy();
    expect(leaguePoints >= 0).toBeTruthy();
    expect(wins).toBeTruthy();
    expect(losses).toBeTruthy();
  });

  it('createLOLAccountByLOLName - lolaccount, tier -kkangsan ', async () => {
    const result = await lolService.upsertLOLAccountByLOLName('kkangsan');
    expect(result).toBeTruthy();
    //
    const lolAccount = await prismaService.lOLAccount.findFirst({
      where: {
        name: 'KkangSan',
      },
    });
    expect(lolAccount).toBeTruthy();
  });

  it('get recent matchIds ', async () => {
    // if lol api key changed will be fail
    const result = await lolService.getRecentMacthIdsBypuuid(
      'PvRocf7pG6jnpKC0aKugs4c-0joi8pUUsV2RKNCjN2fOICtfFqqcRXa9tMTwmmGhJvbnPo2H0nN99A',
    );
    expect(result.length).toBe(10);
    expect(result[0]).toBeTruthy();
    expect(result[9]).toBeTruthy();
  });

  it('get match result and create many and findmany ', async () => {
    // if lol api key changed will be fail
    // "KR_5376935655",
    // "KR_5376789640",
    const result = await lolService.getMathResultByMachIds([
      'KR_5376935655',
      'KR_5376789640',
    ]);
    expect(result.success.length).toBe(2);
    expect(result.fail.length).toBe(0);
    expect(
      result.success[0].value.metadata.participants.includes(
        'PvRocf7pG6jnpKC0aKugs4c-0joi8pUUsV2RKNCjN2fOICtfFqqcRXa9tMTwmmGhJvbnPo2H0nN99A',
      ),
    ).toBeTruthy();
    expect(
      result.success[1].value.metadata.participants.includes(
        'PvRocf7pG6jnpKC0aKugs4c-0joi8pUUsV2RKNCjN2fOICtfFqqcRXa9tMTwmmGhJvbnPo2H0nN99A',
      ),
    ).toBeTruthy();
    // create many
    await lolService.createManyMatchResults(
      result.success.map((result) => {
        return result.value;
      }),
    );
    const res = await lolService.findManyMatchesByIds([
      'KR_5376935655',
      'KR_5376789640',
    ]);
    expect(res[0].metadata.matchId).toBe('KR_5376935655');
    expect(res[0].info.gameId).toBe(5376935655);
    expect(res[0].info.participants[0].assists).toBe(9);
    expect(res[1].metadata.matchId).toBe('KR_5376789640');
    expect(res[1].info.gameId).toBe(5376789640);
    expect(res[1].info.participants[0].assists).toBe(10);
  });

  it('createLOLAccountByLOLName and setup ', async () => {
    const result = await lolService.upsertLOLAccountByLOLName('kkangsan');
    expect(result).toBeTruthy();
    //
    const lolAccount = await prismaService.lOLAccount.findFirst({
      where: {
        name: 'KkangSan',
      },
    });
    const lolAccountId = lolAccount.id;
    await lolService.setupUserRecentMatchesByAccountId(lolAccountId);
    const matches = await prismaService.lOLMatch.count();
    expect(matches).toBe(10); // DEFAULT_MATCH_MAX_COUNT
  });

  it('lol champion setup check', async () => {
    const aatrox = await prismaService.lOLChampion.findUnique({
      where: {
        id: 'Aatrox',
      },
    });
    expect(aatrox.id).toBe('Aatrox');
    expect(aatrox.key).toBe(266);
    expect(aatrox.name).toBe('아트록스');

    const zilean = await prismaService.lOLChampion.findUnique({
      where: {
        id: 'Zilean',
      },
    });
    expect(zilean.id).toBe('Zilean');
    expect(zilean.key).toBe(26);
    expect(zilean.name).toBe('질리언');

    const akshan = await prismaService.lOLChampion.findUnique({
      where: {
        id: 'Akshan',
      },
    });
    expect(akshan.id).toBe('Akshan');
    expect(akshan.key).toBe(166);
    expect(akshan.name).toBe('아크샨');
  });

  it('lol champion get mastery by lol accountId', async () => {
    // if lol api key changed will be fail
    const result = await lolService.getChampionMasteriesByAccountId(
      '65c_hOoDrNNWLfWaPgtudAr15hBpQoeYuQjzf195cUvl5w',
    );
    expect(result.length).toBeGreaterThan(100);
    expect(result[0].championId).toBeTruthy();
    expect(result[0].championLevel).toBeTruthy();
    expect(result[0].championPoints).toBeTruthy();
    expect(result[0].lastPlayTime).toBeTruthy();
    expect(result[99].championId).toBeTruthy();
    expect(result[99].championLevel).toBeTruthy();
    expect(result[99].championPoints).toBeTruthy();
    expect(result[99].lastPlayTime).toBeTruthy();
  });

  it('lol setup champion mastery by lol accountId', async () => {
    // setup
    const result = await lolService.upsertLOLAccountByLOLName('kkangsan');
    expect(result).toBeTruthy();
    // if lol api key changed will be fail
    await lolService.setupChampionMasteriesByAccountId(result);
    const championMasteryCount = await prismaService.lOLChampionMastery.count();
    expect(championMasteryCount).toBeGreaterThan(100);

    const ivernMastery = await prismaService.lOLChampionMastery.findUnique({
      where: {
        LOLChampionMastery_LOLChampionId_LOLAccountId_uniqueConstraint: {
          LOLChampionId: 'Ivern',
          LOLAccountId: result,
        },
      },
    });
    expect(ivernMastery.championPoints).toBeGreaterThanOrEqual(135225);
  });

  it('lol champions', async () => {
    const lolChanpions = await request(app.getHttpServer())
      .get('/lol/champions')
      .set('Accept', 'application/json')
      .type('application/json');

    expect(lolChanpions.body.length).toBe(156);
    expect(lolChanpions.body[0].id).toBe(86);
    expect(lolChanpions.body[0].name).toBe('가렌');
    expect(lolChanpions.body[0].enName).toBe('Garen');
    expect(lolChanpions.body[0].imageUrl).toBe(
      'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/champion/Garen.png',
    );
    expect(lolChanpions.body[155].id).toBe(120);
    expect(lolChanpions.body[155].name).toBe('헤카림');
    expect(lolChanpions.body[155].enName).toBe('Hecarim');
    expect(lolChanpions.body[155].imageUrl).toBe(
      'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/champion/Hecarim.png',
    );
    // by id
    const lolChanpionsGaren = await request(app.getHttpServer())
      .get('/lol/champions/86')
      .set('Accept', 'application/json')
      .type('application/json');
    expect(lolChanpionsGaren.body.id).toBe(86);
    expect(lolChanpionsGaren.body.name).toBe('가렌');
    expect(lolChanpionsGaren.body.enName).toBe('Garen');
    expect(lolChanpionsGaren.body.imageUrl).toBe(
      'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/champion/Garen.png',
    );

    const lolChanpionsHecarim = await request(app.getHttpServer())
      .get('/lol/champions/120')
      .set('Accept', 'application/json')
      .type('application/json');
    expect(lolChanpionsHecarim.body.id).toBe(120);
    expect(lolChanpionsHecarim.body.name).toBe('헤카림');
    expect(lolChanpionsHecarim.body.enName).toBe('Hecarim');
    expect(lolChanpionsHecarim.body.imageUrl).toBe(
      'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/champion/Hecarim.png',
    );
  });

  it('lol compare fields', async () => {
    const lolCompareFields = await request(app.getHttpServer())
      .get('/lol/compareFields')
      .set('Accept', 'application/json')
      .type('application/json');

    expect(lolCompareFields.body.length).toBe(9);
    expect(lolCompareFields.body[0].category).toBe('챔피언');
    expect(lolCompareFields.body[0].fields[0].name).toBe('최고 생존시간');

    const lolCompareFieldById = await request(app.getHttpServer())
      .get('/lol/compareFields/1')
      .set('Accept', 'application/json')
      .type('application/json');

    expect(lolCompareFieldById.body.id).toBe(1);
    expect(lolCompareFieldById.body.lolMatchFieldName).toBe(
      'longestTimeSpentLiving',
    );
    expect(lolCompareFieldById.body.category).toBe('챔피언');
    expect(lolCompareFieldById.body.name).toBe('최고 생존시간');
    expect(lolCompareFieldById.body.enName).toBe('longestTimeSpentLiving');
  });

  it('lol nickname validate', async () => {
    const maybeInvalidateLOLNickName = '129312987417264129_invalidate_nickname';

    await expect(
      lolService.validateLOLNickname(maybeInvalidateLOLNickName),
    ).rejects.toThrow('존재하지 않는 롤 닉네임 입니다.');

    // 휘경동불주먹 - unrank
    const maybeValidateUserAndUnrank = '휘경동불주먹';
    await expect(
      lolService.validateLOLNickname(maybeValidateUserAndUnrank),
    ).rejects.toThrow('티어 정보가 존재하지 않습니다.');
  });
});
