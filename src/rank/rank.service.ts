import { Injectable } from '@nestjs/common';
import { ProfileRank, RankChangedStatus } from './rank-profileRank.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

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
}
