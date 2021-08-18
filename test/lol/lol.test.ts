import { initSchema } from '../commn/schemaUtil';
import { LOLModule } from '../../src/lol/lol.module';
import { LOLService } from '../../src/lol/lol.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const lolService = new LOLService(prismaService);
  beforeAll(async () => {
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
    prismaService.$disconnect();
  });

  beforeEach(async () => {
    await initSchema(prismaService);
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
    expect(leaguePoints).toBeTruthy();
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
});
