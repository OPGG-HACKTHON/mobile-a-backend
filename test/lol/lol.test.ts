import { initSchema } from '../commn/schemaUtil';
import { LOLModule } from '../../src/lol/lol.module';
import { LOLService } from '../../src/lol/lol.service';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

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

  afterAll(() => {
    app.close();
  });
  afterAll(() => {
    prismaService.$disconnect();
  });

  it('getSummerInfoByLOLName test - success kkangsan', async () => {
    const { id, accountId, puuid, name, profileIconId, summonerLevel } =
      await lolService.getLOLAccountByLOLName('kkangsan');
    expect(id).toBeTruthy();
    expect(name).toBe('KkangSan'); // 대소문자 구분되서 결과나옴..(kkangsan -> KkangSan)
    expect(accountId).toBeTruthy();
    expect(puuid).toBeTruthy();
    expect(profileIconId).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
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

  it('check match info ', async () => {
    // if lol api key changed will be fail
    const result = await lolService.getRecentMacthIdsBypuuid(
      'PvRocf7pG6jnpKC0aKugs4c-0joi8pUUsV2RKNCjN2fOICtfFqqcRXa9tMTwmmGhJvbnPo2H0nN99A',
    );
    expect(result.length).toBe(10);
    expect(result[0]).toBeTruthy();
    expect(result[9]).toBeTruthy();
  });
});
