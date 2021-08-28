import { initSchema } from '../commn/schemaUtil';
import { LOLModule } from '../../src/lol/lol.module';
import { LOLService } from '../../src/lol/lol.service';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MatchMetadata } from '../../src/lol/lol-match.model';

describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [LOLModule],
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
    const lolTier = await prismaService.lOLTier.findFirst({
      where: {
        LOLAccountId: lolAccount.id,
      },
    });
    expect(lolTier).toBeTruthy();
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
});
