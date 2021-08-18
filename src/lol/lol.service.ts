import { Injectable } from '@nestjs/common';
import got from 'got';
import { SUMMONER, Tier, LEAGUE } from './lol.types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LOLService {
  private readonly API_KEY = process.env.LOL_API_KEY;
  private readonly SUMMONER_V4_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners';

  private readonly LEAGUE_V4_URL =
    'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner';

  constructor(private readonly prisma: PrismaService) {}

  async getLOLAccountByLOLName(param: string): Promise<SUMMONER> {
    const result = await got
      .get(this.SUMMONER_V4_URL + '/by-name' + '/' + param, {
        headers: {
          'X-Riot-Token': this.API_KEY,
        },
      })
      .json<SUMMONER>();
    if (!result.name) {
      throw new Error('LOL Name not found');
    }
    return result;
  }

  async getLOLTierByLOLId(param: string): Promise<Tier> {
    const apiResults = await got
      .get(this.LEAGUE_V4_URL + '/' + param, {
        headers: {
          'X-Riot-Token': this.API_KEY,
        },
      })
      .json<LEAGUE[]>();
    const result = apiResults.filter(
      (apiResult) => apiResult.queueType === 'RANKED_FLEX_SR',
    );
    if (!result.length) {
      throw new Error('Tier not found');
    }
    const { tier, rank, leaguePoints, wins, losses } = result[0];
    return { tier, rank, leaguePoints, wins, losses };
  }

  private async upsertLOLAccount(param: SUMMONER): Promise<SUMMONER> {
    return await this.prisma.lOLAccount.upsert({
      where: {
        id: param.id,
      },
      update: {
        accountId: param.accountId,
        puuid: param.puuid,
        name: param.name,
        profileIconId: param.profileIconId,
        summonerLevel: param.summonerLevel,
      },
      create: {
        id: param.id,
        accountId: param.accountId,
        puuid: param.puuid,
        name: param.name,
        profileIconId: param.profileIconId,
        summonerLevel: param.summonerLevel,
      },
    });
  }

  private async upsertLOLTierWithLOLAccountId(
    lolAccountId: string,
    param: Tier,
  ): Promise<Tier> {
    return await this.prisma.lOLTier.upsert({
      where: {
        LOLAccountId: lolAccountId,
      },
      update: {
        tier: param.tier,
        rank: param.rank,
        leaguePoints: param.leaguePoints,
        wins: param.wins,
        losses: param.losses,
      },
      create: {
        tier: param.tier,
        rank: param.rank,
        leaguePoints: param.leaguePoints,
        wins: param.wins,
        losses: param.losses,
        LOLAccountId: lolAccountId,
      },
    });
  }

  async upsertLOLAccountByLOLName(param: string): Promise<string> {
    const lolAccount = await this.getLOLAccountByLOLName(param);
    const lolTier = await this.getLOLTierByLOLId(lolAccount.id);
    await this.upsertLOLAccount(lolAccount);
    await this.upsertLOLTierWithLOLAccountId(lolAccount.id, lolTier);
    return lolAccount.id;
  }
}
