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
    const lolAccountIdToProfileMap: Map<string, Profile> = new Map();
    for (const user of users) {
      // todo => getProfileByUserIds
      const profile = await this.userService.getProfileByUserId(user.id);
      lolAccountIdToProfileMap.set(user.LOLAccountId, profile);
    }
    const lolAccountIds = users.map((user) => user.LOLAccountId);
    const category = await this.prisma.lOLSummaryElement.findFirst({
      where: {
        LOLMatchFieldName: '티어',
      },
    });

    //
    const ranks = await this.prisma.lOLSummaryPersonal.findMany({
      where: {
        AND: { LOLSummaryElementId: category.id },
        LOLAccountId: { in: lolAccountIds },
      },
      orderBy: {
        value: 'desc',
      },
    });
    const results = [];
    for (const rank of ranks) {
      results.push(lolAccountIdToProfileMap.get(rank.LOLAccountId));
    }
    return results;
  }
}
