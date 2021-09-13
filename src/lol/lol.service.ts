import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import got from 'got';
import { Tier } from './lol-tier.model';
import { SUMMONER } from './lol-summoner.model';
import { PrismaService } from '../prisma/prisma.service';
import { Match } from './lol-match.model';
import { LOLMatch, LOLSummaryElement, Prisma, User } from '@prisma/client';
import { CHAMPION } from './lol-champion.model';
import { CHAMPION_MASTERY } from './lol-championMastery.model';
import { LOLChampionDTO } from './lol-champion.dto';
import {
  LOLCompareFieldDetailDTO,
  LOLCompareFieldDTO,
} from './lol-compareField.dto';
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
  private readonly DEFAULT_MATCH_MAX_COUNT = 50;

  private readonly CHAMPION_MASTERY_V4_URL =
    'https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries';

  private readonly CHAMPION_IMAGE_URL =
    'https://static.opggmobilea.com/dragontail-11.15.1/img/champion';

  championsOrderByName: LOLChampionDTO[];
  championIdAndChampionDTOMap = new Map<number, LOLChampionDTO>();

  cachedLOLCompareField: LOLCompareFieldDTO[];
  cachedLOLCompareFieldIdToFieldMap = new Map<
    number,
    LOLCompareFieldDetailDTO
  >();

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const champions = await this.getRawChampionsData();
    this.setChampionMemoryCacheByRawChampionsData(champions);
    // create champions
    await this.prisma.lOLChampion.createMany({
      data: champions,
      skipDuplicates: true,
    });
  }

  async getRawChampionsData(): Promise<
    {
      id: string;
      name: string;
      key: number;
    }[]
  > {
    const championsRaw = await got
      .get(this.CHAMPION_INFO_URL)
      .json<{ data: CHAMPION }>();
    const champions = Object.keys(championsRaw.data).map((champion) => {
      const { id, name, key } = championsRaw.data[champion];
      return { id, name, key: parseInt(key) };
    });
    return champions;
  }

  setChampionMemoryCacheByRawChampionsData(
    params: {
      id: string;
      name: string;
      key: number;
    }[],
  ): void {
    this.championsOrderByName = params
      .map((champion) => {
        const championDTO = {
          id: champion.key,
          name: champion.name,
          enName: champion.id,
          imageUrl:
            this.CHAMPION_IMAGE_URL + '/tiles/' + champion.id + '_0.jpg',
          loadingUrl:
            this.CHAMPION_IMAGE_URL + '/loading/' + champion.id + '_0.jpg',
          splashUrl:
            this.CHAMPION_IMAGE_URL + '/splash/' + champion.id + '_0.jpg',
        };
        this.championIdAndChampionDTOMap.set(champion.key, championDTO);
        return championDTO;
      })
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
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
      .json<(Tier & { queueType: 'RANKED_FLEX_SR' & 'RANKED_SOLO_5x5' })[]>();
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
        value: tierSummaryValue,
        exposureValue: tierSummaryValue.toString(),
      },
      create: {
        LOLAccountId: id,
        LOLSummaryElementId: category.id,
        value: tierSummaryValue,
        exposureValue: tierSummaryValue.toString(),
      },
    });
  }

  async upsertLOLAccountByLOLName(param: string): Promise<string> {
    const lolAccount = await this.getLOLAccountByLOLName(param);
    await this.upsertLOLAccount(lolAccount);
    return lolAccount.id;
  }

  async syncAllLOLData(lolAccountId: string, userId: number): Promise<void> {
    const lolTier = await this.getLOLTierByLOLId(lolAccountId);
    await this.upsertLOLTierWithLOLAccountId(lolAccountId, lolTier);
    await this.upsertTierSummaryWithAccountId(lolAccountId, lolTier);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // Tier
    const lOLSummaryPersonal = await this.prisma.lOLSummaryPersonal.findFirst({
      where: {
        LOLSummaryElement: {
          LOLMatchFieldName: '티어',
        },
        LOLAccountId: lolAccountId,
      },
    });
    await this.prisma.lOLRankInSchool.create({
      data: {
        LOLSummaryElementId: lOLSummaryPersonal.LOLSummaryElementId,
        userId: user.id,
        schoolId: user.schoolId,
        LOLSummaryPersonalId: lOLSummaryPersonal.id,
      },
    });

    // mastery - summary
    await this.upsertLOLSummaryPersonalMasteryByLOLAccountIdAndUser(
      lolAccountId,
      user,
    );

    // match - summary
    await this.setLOLSummaryPersonalByLOLAccountIdAndUserId(lolAccountId, user);
  }
  async setLOLSummaryPersonalByLOLAccountIdAndUserId(
    lolAccountId: string,
    user: User,
  ): Promise<void> {
    const lolInfo = await this.prisma.lOLAccount.findUnique({
      where: {
        id: lolAccountId,
      },
    });
    const matchIds = await this.getRecentMacthIdsBypuuid(lolInfo.puuid);
    await this.setupUserRecentMatchesByAccountId(matchIds);
    const matches = await this.prisma.lOLMatch.findMany({
      where: {
        id: {
          in: matchIds,
        },
      },
    });
    const elemets = await this.prisma.lOLSummaryElement.findMany();
    const elementWithFields = elemets.filter(
      (ele) => !['캐릭터숙련도', '티어'].includes(ele.LOLMatchFieldName),
    );
    const createInputs: {
      LOLAccountId: string;
      LOLSummaryElementId: number;
      LOLChampionId: string;
      value: number;
      exposureValue: string;
    }[] = [];

    for (const elementWithField of elementWithFields) {
      const matchesValues =
        this.parseChampionIdAndLOLMatchFieldDatasByPuuidAndMatchesAndLOLSummaryElement(
          lolInfo.puuid,
          matches,
          elementWithField,
        );
      if (elementWithField.calculateType === '평균') {
        const matchesAndAvgValue = matchesValues.map((matchesValue) => {
          let avgValue =
            matchesValue.values.reduce((sum, value) => {
              return (sum += value);
            }, 0) / matchesValue.values.length;
          avgValue = Math.round((avgValue + Number.EPSILON) * 10) / 10;
          return {
            championId: matchesValue.championId,
            avgValue: avgValue,
          };
        });
        for (const matchAndAvgValue of matchesAndAvgValue) {
          const lolChampion = await this.prisma.lOLChampion.findUnique({
            where: {
              key: matchAndAvgValue.championId,
            },
          });
          const createInput = {
            LOLAccountId: lolAccountId,
            LOLSummaryElementId: elementWithField.id,
            LOLChampionId: lolChampion.id,
            value: matchAndAvgValue.avgValue,
            exposureValue: matchAndAvgValue.avgValue.toString(),
          };
          createInputs.push(createInput);
        }
      }
      if (elementWithField.calculateType === '최고기록') {
        const matchesAndMaxValue = matchesValues.map((matchesValue) => {
          return {
            championId: matchesValue.championId,
            maxValue: Math.max(...matchesValue.values),
          };
        });
        for (const matchAndMaxValue of matchesAndMaxValue) {
          const lolChampion = await this.prisma.lOLChampion.findUnique({
            where: {
              key: matchAndMaxValue.championId,
            },
          });
          const exposureValueDate = new Date(0);
          exposureValueDate.setSeconds(matchAndMaxValue.maxValue);
          const createInput = {
            LOLAccountId: lolAccountId,
            LOLSummaryElementId: elementWithField.id,
            LOLChampionId: lolChampion.id,
            value: matchAndMaxValue.maxValue,
            exposureValue: new Date(matchAndMaxValue.maxValue * 1000)
              .toISOString()
              .slice(11, 19),
          };
          createInputs.push(createInput);
        }
      }
    }

    await this.upsertManyLOLSummaryPersonalAndLOLRankInSchoolByParamAndUser(
      createInputs,
      user,
    );
    // const results = await this.prisma.lOLRankInSchool.findMany();
    // results.forEach((result) => console.log(result));
  }

  // todo - skip for performance
  // async syncNowRankToPrevRankByUserAndElementId(
  //   user: User,
  //   elementId: number,
  // ): Promise<void> {
  //   const userRanks = await this.prisma.lOLRankInSchool.findMany({
  //     where: {
  //       schoolId: user.schoolId,
  //       LOLSummaryElementId: elementId,
  //     },
  //     orderBy: {
  //       LOLSummaryPersonal: {
  //         value: 'desc',
  //       },
  //     },
  //   });
  //   for (const [idx, userRank] of userRanks.entries()) {
  //     await this.prisma.lOLRankInSchool.update({
  //       where: {
  //         id: userRank.id,
  //       },
  //       data: {
  //         prevRank: idx + 1,
  //       },
  //     });
  //   }
  // }

  async upsertManyLOLSummaryPersonalAndLOLRankInSchoolByParamAndUser(
    params: {
      LOLAccountId: string;
      LOLSummaryElementId: number;
      LOLChampionId: string;
      value: number;
      exposureValue: string;
    }[],
    user: User,
  ): Promise<void> {
    // todo - skip for performance
    // await this.syncNowRankToPrevRankByUserAndElementId(
    //   user,
    //   param.LOLSummaryElementId,
    // );
    const promises = [];
    for (const param of params) {
      const promise = this.prisma.lOLSummaryPersonal.upsert({
        where: {
          LOLSummaryPersonal_LOLAccountId_LOLSummaryElementId_LOLChampionId_uniqueConstraint:
            {
              LOLAccountId: param.LOLAccountId,
              LOLSummaryElementId: param.LOLSummaryElementId,
              LOLChampionId: param.LOLChampionId,
            },
        },
        create: {
          ...param,
          LOLRankInSchool: {
            create: {
              LOLSummaryElementId: param.LOLSummaryElementId,
              userId: user.id,
              schoolId: user.schoolId,
            },
          },
        },
        update: {
          value: param.value,
          exposureValue: param.exposureValue,
        },
      });
      promises.push(promise);
    }
    await Promise.all(promises);
  }

  parseChampionIdAndLOLMatchFieldDatasByPuuidAndMatchesAndLOLSummaryElement(
    puuid: string,
    matches: LOLMatch[],
    lolSummaryElement: LOLSummaryElement,
  ): { championId: number; values: number[] }[] {
    const result: { championId: number; values: number[] }[] = [];
    const championIdToValues = new Map<number, number[]>();
    matches.forEach((match) => {
      const matchResults = match.info['participants'];
      const matchResult = matchResults.find((result) => result.puuid === puuid);
      const championId = matchResult['championId'] as number;
      let value = matchResult[lolSummaryElement.LOLMatchFieldName] as
        | number
        | boolean;
      if (typeof value === 'boolean') {
        value = value === true ? 1 : 0;
      }
      const values = championIdToValues.get(championId);
      if (values) {
        values.push(value);
      } else {
        championIdToValues.set(championId, [value]);
      }
    });
    championIdToValues.forEach((values, championId) => {
      result.push({ championId: championId, values: values });
    });
    return result;
  }

  async upsertLOLSummaryPersonalMasteryByLOLAccountIdAndUser(
    lolAccountId: string,
    user: User,
  ): Promise<void> {
    await this.setupChampionMasteriesByAccountId(lolAccountId);
    const lolSummaryElement = await this.prisma.lOLSummaryElement.findFirst({
      where: {
        LOLMatchFieldName: '캐릭터숙련도',
      },
    });
    const lolChampionsMastery = await this.prisma.lOLChampionMastery.findMany({
      where: {
        LOLAccountId: lolAccountId,
      },
    });
    const lolSummaries = lolChampionsMastery.map((mastery) => {
      return {
        LOLAccountId: lolAccountId,
        LOLSummaryElementId: lolSummaryElement.id,
        LOLChampionId: mastery.LOLChampionId,
        value: mastery.championPoints,
        exposureValue: mastery.championPoints.toString(),
      };
    });
    await this.prisma.lOLSummaryPersonal.createMany({
      data: lolSummaries,
    });
    const createdLOLSummaries = await this.prisma.lOLSummaryPersonal.findMany({
      where: {
        LOLSummaryElementId: lolSummaryElement.id,
        LOLAccountId: lolAccountId,
      },
    });
    const lolRankInSchoolElements = createdLOLSummaries.map((summary) => {
      return {
        userId: user.id,
        schoolId: user.schoolId,
        LOLSummaryPersonalId: summary.id,
        LOLSummaryElementId: lolSummaryElement.id,
      };
    });
    // todo - skip for performance
    // await this.syncNowRankToPrevRankByUserAndElementId(
    //   user,
    //   lolSummaryElement.id,
    // );
    await this.prisma.lOLRankInSchool.createMany({
      data: lolRankInSchoolElements,
    });
  }

  async setupUserRecentMatchesByAccountId(
    recentMatchIds: string[],
  ): Promise<void> {
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
          'type=ranked&' +
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

  async setupChampionMasteriesByAccountId(LOLAccountId: string): Promise<void> {
    const rawChampionMasteries = await this.getChampionMasteriesByAccountId(
      LOLAccountId,
    );
    const championMasteriesies = rawChampionMasteries.map(
      ({ lastPlayTime, ...rest }) => {
        return {
          lastPlayTime: new Date(lastPlayTime),
          ...rest,
        };
      },
    );
    const champions = await this.prisma.lOLChampion.findMany({
      where: {
        key: {
          in: championMasteriesies.map(({ championId }) => championId),
        },
      },
    });
    //
    const championIdToLOLChampionIdMap = new Map<number, string>();
    champions.forEach(({ key, id }) =>
      championIdToLOLChampionIdMap.set(key, id),
    );

    await this.prisma.$transaction(
      championMasteriesies.map((champion) => {
        const LOLChampionId = championIdToLOLChampionIdMap.get(
          champion.championId,
        );
        return this.prisma.lOLChampionMastery.upsert({
          where: {
            LOLChampionMastery_LOLChampionId_LOLAccountId_uniqueConstraint: {
              LOLAccountId: LOLAccountId,
              LOLChampionId: LOLChampionId,
            },
          },
          create: {
            LOLChampionId: LOLChampionId,
            championPoints: champion.championPoints,
            lastPlayTime: champion.lastPlayTime,
            LOLAccountId: LOLAccountId,
          },
          update: {
            championPoints: champion.championPoints,
            lastPlayTime: champion.lastPlayTime,
          },
        });
      }),
    );
  }

  async getChampionMasteriesByAccountId(
    id: string,
  ): Promise<CHAMPION_MASTERY[]> {
    const result = await got
      .get(this.CHAMPION_MASTERY_V4_URL + '/by-summoner' + '/' + id, {
        headers: {
          'X-Riot-Token': this.API_KEY,
        },
      })
      .json<CHAMPION_MASTERY[]>();
    return result;
  }

  getChampions(): LOLChampionDTO[] {
    return this.championsOrderByName;
  }

  getChampionById(id: number): LOLChampionDTO {
    return this.championIdAndChampionDTOMap.get(id);
  }

  private makeLOLElementsToLOLCompareFieldDTOs(
    elements: LOLSummaryElement[],
  ): LOLCompareFieldDTO[] {
    const categoryAndDetailMap = new Map<string, LOLCompareFieldDetailDTO[]>();
    elements.forEach((element) => {
      const detaileArr = categoryAndDetailMap.get(
        element.LOLMatchFieldCategory,
      );
      const detail = {
        id: element.id,
        lolMatchFieldName: element.LOLMatchFieldName,
        category: element.LOLMatchFieldCategory,
        name: element.LOLMatchFieldKoName,
        enName: element.LOLMatchFieldName,
      };
      if (!detaileArr) {
        const arr: LOLCompareFieldDetailDTO[] = [];
        arr.push(detail);
        categoryAndDetailMap.set(element.LOLMatchFieldCategory, arr);
      } else {
        detaileArr.push(detail);
      }
    });
    const result: LOLCompareFieldDTO[] = [];
    categoryAndDetailMap.forEach((detailArr, category) => {
      result.push({ category: category, fields: detailArr });
    });
    return result;
  }

  private async setCacheCompareField(): Promise<void> {
    const elementsFindAll = await this.prisma.lOLSummaryElement.findMany();
    const elements = elementsFindAll.filter((element) => {
      return !['티어'].includes(element.LOLMatchFieldName);
    });
    const results = this.makeLOLElementsToLOLCompareFieldDTOs(elements);
    this.cachedLOLCompareField = results;
    results.forEach((result) => {
      result.fields.forEach((field) => {
        this.cachedLOLCompareFieldIdToFieldMap.set(field.id, field);
      });
    });
  }

  async getCompareFields(): Promise<LOLCompareFieldDTO[]> {
    if (this.cachedLOLCompareField && this.cachedLOLCompareField.length) {
      return this.cachedLOLCompareField;
    } else {
      await this.setCacheCompareField();
      return await this.cachedLOLCompareField;
    }
  }
  async getCompareFieldDetailById(
    param: number,
  ): Promise<LOLCompareFieldDetailDTO> {
    if (
      this.cachedLOLCompareFieldIdToFieldMap &&
      this.cachedLOLCompareFieldIdToFieldMap.has(param)
    ) {
      return this.cachedLOLCompareFieldIdToFieldMap.get(param);
    } else {
      await this.setCacheCompareField();
      return await this.cachedLOLCompareFieldIdToFieldMap.get(param);
    }
  }

  async validateLOLNickname(nickname: string): Promise<void> {
    // nickname
    let summoner: SUMMONER;
    try {
      summoner = await got
        .get(this.SUMMONER_V4_URL + '/by-name' + '/' + nickname, {
          headers: {
            'X-Riot-Token': this.API_KEY,
          },
        })
        .json<SUMMONER>();
    } catch (err) {
      throw new BadRequestException('존재하지 않는 롤 닉네임 입니다.');
    }
    // Tier
    try {
      const apiResults = await got
        .get(this.LEAGUE_V4_URL + '/' + summoner.id, {
          headers: {
            'X-Riot-Token': this.API_KEY,
          },
        })
        .json<(Tier & { queueType: 'RANKED_FLEX_SR' & 'RANKED_SOLO_5x5' })[]>();
      const result = apiResults.filter(
        (apiResult) => apiResult.queueType === 'RANKED_SOLO_5x5',
      );
      if (!result.length) {
        throw new Error();
      }
    } catch (err) {
      throw new BadRequestException('티어 정보가 존재하지 않습니다.');
    }
    try {
      const result = await got
        .get(
          this.MATCH_V5_URL +
            '/by-puuid' +
            '/' +
            summoner.puuid +
            '/ids?' +
            'type=ranked&' +
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
      if (!result.length) {
        throw new Error();
      }
    } catch (err) {
      throw new BadRequestException('랭크 매치 정보가 존재하지 않습니다.');
    }
  }
}
