import { Injectable } from '@nestjs/common';
import { ProfileRank } from './rank-profileRank.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
@Injectable()
export class RankService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getProfileRanksByScoolId(schoolId: string): Promise<ProfileRank[]> {
    const users = await this.prisma.user.findMany({
      where: {
        schoolId: schoolId,
      },
    });
    const lolAccountIds = users.map((user) => user.LOLAccountId);
    const category = await this.prisma.lOLSummaryElement.findFirst({
      where: {
        LOLMatchFieldName: '티어',
      },
      include: {
        LOLSummaryPersonal: {
          where: {
            LOLAccountId: { in: lolAccountIds },
          },
          orderBy: {
            value: 'desc',
          },
          include: {
            LOLAccount: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    });
    const rankUsers = category.LOLSummaryPersonal.map(
      (param) => param.LOLAccount.User,
    );
    //
    const results: ProfileRank[] = [];
    for (const [idx, user] of rankUsers.entries()) {
      // userIds
      const { ...rest } = await this.userService.getProfileByUserId(user.id);
      const inputProfile = { seqNo: idx + 1, ...rest };
      results.push(inputProfile);
    }
    return results;
  }

  async getProfileRankByScoolIdAndUserId(
    schoolId: string,
    userId: number,
  ): Promise<ProfileRank> {
    const users = await this.prisma.user.findMany({
      where: {
        schoolId: schoolId,
      },
    });
    const lolAccountIds = users.map((user) => user.LOLAccountId);
    const category = await this.prisma.lOLSummaryElement.findFirst({
      where: {
        LOLMatchFieldName: '티어',
      },
      include: {
        LOLSummaryPersonal: {
          where: {
            LOLAccountId: { in: lolAccountIds },
          },
          orderBy: {
            value: 'desc',
          },
          include: {
            LOLAccount: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    });
    const rankUsers = category.LOLSummaryPersonal.map(
      (param) => param.LOLAccount.User,
    );
    //
    let result: ProfileRank;
    for (const [idx, user] of rankUsers.entries()) {
      if (user.id === userId) {
        const { ...rest } = await this.userService.getProfileByUserId(user.id);
        const inputProfile = { seqNo: idx + 1, ...rest };
        result = inputProfile;
        break;
      }
    }
    return result;
  }
}
