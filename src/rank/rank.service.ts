import { Injectable } from '@nestjs/common';
import { Profile } from 'src/user/user.types';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
@Injectable()
export class RankService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getRankByScoolId(schoolId: number): Promise<Profile[]> {
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
    const results = [];
    for (const user of rankUsers) {
      // userIds
      const profile = await this.userService.getProfileByUserId(user.id);
      results.push(profile);
    }
    return results;
  }
}
