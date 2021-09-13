import { Injectable } from '@nestjs/common';
import { ProfileRank, RankChangedStatus } from './rank-profileRank.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ProfileRankWithCompareField } from './rank-profileRankWithConpareField.dto';
import { LOLRankInSchool, LOLSummaryPersonal } from '@prisma/client';

@Injectable()
export class RankService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  private makeRankChangedStatusByNowRankAndPrevRank(
    nowRank: number,
    prevRank?: number,
  ): RankChangedStatus {
    let result: RankChangedStatus;
    if (!prevRank) {
      result = RankChangedStatus.NEW;
    } else {
      const upChanged = prevRank - nowRank;
      if (upChanged === 0) {
        result = RankChangedStatus.SAME;
      } else if (upChanged > 0) {
        result = RankChangedStatus.UP;
      } else {
        result = RankChangedStatus.DOWN;
      }
    }

    return result;
  }

  async getProfileRanksByScoolId(schoolId: string): Promise<ProfileRank[]> {
    const lolRanksInSchool = await this.prisma.lOLRankInSchool.findMany({
      where: {
        LOLSummaryPersonal: {
          LOLSummaryElement: {
            LOLMatchFieldName: '티어',
          },
        },
        User: {
          schoolId: schoolId,
        },
      },
      orderBy: {
        LOLSummaryPersonal: {
          value: 'desc',
        },
      },
    });

    const results: ProfileRank[] = [];
    for (const [idx, lolRankInSchool] of lolRanksInSchool.entries()) {
      // userIds
      const { ...rest } = await this.userService.getProfileByUserId(
        lolRankInSchool.userId,
      );
      const rankNo = idx + 1;
      const rankChangedStatus = this.makeRankChangedStatusByNowRankAndPrevRank(
        rankNo,
        lolRankInSchool.prevRank,
      );
      const inputProfile = {
        rankNo: rankNo,
        rankChangedStatus: rankChangedStatus,
        ...rest,
      };
      results.push(inputProfile);
    }
    return results;
  }

  async getProfileRankByScoolIdAndUserId(
    schoolId: string,
    userId: number,
  ): Promise<ProfileRank> {
    const lolRanksInSchool = await this.prisma.lOLRankInSchool.findMany({
      where: {
        LOLSummaryPersonal: {
          LOLSummaryElement: {
            LOLMatchFieldName: '티어',
          },
        },
        User: {
          schoolId: schoolId,
        },
      },
      orderBy: {
        LOLSummaryPersonal: {
          value: 'desc',
        },
      },
    });

    let result: ProfileRank;
    for (const [idx, lolRankInSchool] of lolRanksInSchool.entries()) {
      if (lolRankInSchool.userId === userId) {
        const { ...rest } = await this.userService.getProfileByUserId(
          lolRankInSchool.userId,
        );
        const rankNo = idx + 1;
        const rankChangedStatus =
          this.makeRankChangedStatusByNowRankAndPrevRank(
            rankNo,
            lolRankInSchool.prevRank,
          );
        const inputProfile = {
          rankNo: rankNo,
          rankChangedStatus: rankChangedStatus,
          ...rest,
        };
        result = inputProfile;
        break;
      }
    }
    return result;
  }

  async getProfileRankWithCompareFieldArrByLOLRankInSchoolsAndCompareFieldId(
    params: (LOLRankInSchool & {
      LOLSummaryPersonal: LOLSummaryPersonal;
    })[],
    fieldId: number,
  ): Promise<ProfileRankWithCompareField[]> {
    const results: ProfileRankWithCompareField[] = [];

    const field = await this.prisma.lOLSummaryElement.findUnique({
      where: {
        id: fieldId,
      },
    });
    const fieldName = field.LOLMatchFieldKoName;

    for (const [idx, param] of params.entries()) {
      const profile = await this.userService.getProfileByUserId(param.userId);
      const rankNo = idx + 1;
      const rankChangedStatus = this.makeRankChangedStatusByNowRankAndPrevRank(
        rankNo,
        param.prevRank,
      );
      const value = param.LOLSummaryPersonal.exposureValue;

      const result = {
        ...profile,
        rankNo,
        rankChangedStatus,
        value,
        fieldName,
      };
      results.push(result);
    }
    return results;
  }

  async getProfilesRankWithCompareFieldByParams(
    championId: number,
    compareFieldId: number,
    schoolId: string,
  ): Promise<ProfileRankWithCompareField[]> {
    const LOLRankInSchool = await this.prisma.lOLRankInSchool.findMany({
      where: {
        schoolId: schoolId,
        LOLSummaryPersonal: {
          LOLChampion: {
            key: championId,
          },
          LOLSummaryElement: {
            id: compareFieldId,
          },
        },
      },
      orderBy: {
        LOLSummaryPersonal: {
          value: 'desc',
        },
      },
      include: {
        LOLSummaryPersonal: true,
      },
    });
    const results =
      await this.getProfileRankWithCompareFieldArrByLOLRankInSchoolsAndCompareFieldId(
        LOLRankInSchool,
        compareFieldId,
      );
    return results;
  }

  async getProfileRankWithCompareFieldByParams(
    championId: number,
    compareFieldId: number,
    schoolId: string,
    userId: number,
  ): Promise<ProfileRankWithCompareField> {
    const LOLRankInSchool = await this.prisma.lOLRankInSchool.findMany({
      where: {
        schoolId: schoolId,
        LOLSummaryPersonal: {
          LOLChampion: {
            key: championId,
          },
          LOLSummaryElement: {
            id: compareFieldId,
          },
        },
      },
      orderBy: {
        LOLSummaryPersonal: {
          value: 'desc',
        },
      },
      include: {
        LOLSummaryPersonal: true,
      },
    });
    const field = await this.prisma.lOLSummaryElement.findUnique({
      where: {
        id: compareFieldId,
      },
    });
    const fieldName = field.LOLMatchFieldKoName;
    const profile = await this.userService.getProfileByUserId(userId);
    // default result
    const result = {
      fieldName: fieldName,
      value: '-',
      rankNo: 0,
      rankChangedStatus: RankChangedStatus.SAME,
      ...profile,
    };
    for (const [index, element] of LOLRankInSchool.entries()) {
      if (element.userId === userId) {
        result.rankNo = index + 1;
        result.value = element.LOLSummaryPersonal.exposureValue;
        result.rankChangedStatus = RankChangedStatus.NEW;
        break;
      }
    }
    return result;
  }
}
