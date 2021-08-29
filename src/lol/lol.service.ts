import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import got from 'got';
import { SUMMONER, Tier, LEAGUE } from './lol.types';
import { PrismaService } from '../prisma/prisma.service';
import { Match } from './lol-match.model';
import { LOLMatch } from '@prisma/client';
import { CHAMPION } from './lol-champion.model';
@Injectable()
export class LOLService implements OnApplicationBootstrap {
  private readonly API_KEY = process.env.LOL_API_KEY;
  private readonly SUMMONER_V4_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners';

  private readonly LEAGUE_V4_URL =
    'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner';

  private readonly MATCH_V5_URL =
    'https://asia.api.riotgames.com/lol/match/v5/matches';

  private readonly CHAMPION_INFO_URL =
    'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/data/ko_KR/champion.json';
  private readonly DEFAULT_MATCH_MAX_COUNT = 10;

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const championsRaw = await got
      .get(this.CHAMPION_INFO_URL)
      .json<{ data: CHAMPION }>();
    const champions = Object.keys(championsRaw.data).map((champion) => {
      const { id, name, key } = championsRaw.data[champion];
      return { id, name, key: parseInt(key) };
    });
    await this.prisma.lOLChampion.createMany({
      data: champions,
      skipDuplicates: true,
    });
  }

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
      (apiResult) => apiResult.queueType === 'RANKED_SOLO_5x5',
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

  private tierTovalue(tierInfo: Tier): number {
    const tierToValue = {
      CHALLENGER: 4500,
      GRANDMASTER: 4000,
      MASTER: 3500,
      DIAMOND: 3000,
      PLATINUM: 2500,
      GOLD: 2000,
      SILVER: 1500,
      BRONZE: 1000,
      IRON: 500,
    };
    const rankToValue = {
      I: 300,
      II: 200,
      III: 100,
      IV: 0,
    };
    return (
      (tierToValue[tierInfo.tier] || 0) +
      (rankToValue[tierInfo.rank] || 0) +
      tierInfo.leaguePoints
    );
  }

  private async upsertTierSummaryWithAccountId(id: string, tierInfo: Tier) {
    const category = await this.prisma.lOLSummaryElement.findFirst({
      where: {
        LOLMatchFieldName: '티어',
      },
    });
    if (!category) {
      console.log('티어 카테고리 정보 없음!');
      return;
    }
    const tierSummaryValue = this.tierTovalue(tierInfo);

    await this.prisma.lOLSummaryPersonal.upsert({
      where: {
        LOLSummaryPersonal_LOLAccountId_LOLSummaryElementId_LOLChampionId_uniqueConstraint:
          {
            LOLAccountId: id,
            LOLSummaryElementId: category.id,
            LOLChampionId: '',
          },
      },
      update: {
        value: tierSummaryValue.toString(),
      },
      create: {
        LOLAccountId: id,
        LOLSummaryElementId: category.id,
        value: tierSummaryValue.toString(),
      },
    });
  }

  async upsertLOLAccountByLOLName(param: string): Promise<string> {
    const lolAccount = await this.getLOLAccountByLOLName(param);
    const lolTier = await this.getLOLTierByLOLId(lolAccount.id);
    await this.upsertLOLAccount(lolAccount);
    await this.upsertLOLTierWithLOLAccountId(lolAccount.id, lolTier);
    await this.upsertTierSummaryWithAccountId(lolAccount.id, lolTier);
    return lolAccount.id;
  }

  async setupUserRecentMatchesByAccountId(accountId: string): Promise<void> {
    const lolAccount = await this.prisma.lOLAccount.findUnique({
      where: {
        id: accountId,
      },
    });
    const puuid = lolAccount.puuid;
    const recentMatchIds = await this.getRecentMacthIdsBypuuid(puuid);
    const existMatches = await this.findManyMatchesByIds(recentMatchIds);
    const existMatchIds = existMatches.map((match) => match.metadata.matchId);
    const needCreateMatches = recentMatchIds.filter(
      (recentMatchId) => !existMatchIds.includes(recentMatchId),
    );
    if (needCreateMatches.length) {
      const recentMatchesRequestResult = await this.getMathResultByMachIds(
        needCreateMatches,
      );
      const recentMatches = recentMatchesRequestResult.success.map(
        (param) => param.value,
      );
      await this.createManyMatchResults(recentMatches);
    }
  }

  async getRecentMacthIdsBypuuid(id: string): Promise<string[]> {
    const result = await got
      .get(
        this.MATCH_V5_URL +
          '/by-puuid' +
          '/' +
          id +
          '/ids?' +
          'start=0&' +
          'count=' +
          this.DEFAULT_MATCH_MAX_COUNT,
        {
          headers: {
            'X-Riot-Token': this.API_KEY,
          },
        },
      )
      .json<string[]>();
    return result;
  }

  async getMathResultByMachIds(ids: string[]): Promise<{
    success: PromiseFulfilledResult<Match>[];
    fail: PromiseRejectedResult[];
  }> {
    const matchReqs = ids.map((id) => {
      return got
        .get(this.MATCH_V5_URL + '/' + id, {
          headers: {
            'X-Riot-Token': this.API_KEY,
          },
        })
        .json<Match>();
    });
    const reqsResults = await Promise.allSettled(matchReqs);
    return {
      success: reqsResults.filter(
        (req) => req.status === 'fulfilled',
      ) as PromiseFulfilledResult<Match>[],
      fail: reqsResults.filter(
        (req) => req.status === 'rejected',
      ) as PromiseRejectedResult[],
    };
  }

  async createManyMatchResults(matches: Match[]): Promise<void> {
    const inputMatches = matches.map((match) => {
      return {
        id: match.metadata.matchId,
        metadata: match.metadata,
        info: match.info,
      };
    });
    await this.prisma.lOLMatch.createMany({
      data: inputMatches,
      skipDuplicates: true,
    });
  }

  async findManyMatchesByIds(ids: string[]): Promise<Match[]> {
    const lolMatches = await this.prisma.lOLMatch.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return lolMatches.map(this.convertLOLMatchToMatch);
  }

  convertLOLMatchToMatch(param: LOLMatch): Match {
    const inputed = param as any; // for jsonObject to jsonValue
    return { metadata: inputed.metadata, info: inputed.info };
  }
}
