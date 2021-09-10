import { Injectable } from '@nestjs/common';
import { ProfileDTO } from '../user/user-profile.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { BattleResult, ProfileBattleDTO } from './battle-log.dto';

@Injectable()
export class BattleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // searchUser(): string {
  //   return 'will search user';
  // }

  // compare(): string {
  //   return 'will compare between two user data';
  // }

  // requestChallenge(): string {
  //   return 'will request challenge';
  // }

  async searchProfilesBylolNickname(
    param: string,
  ): Promise<ProfileBattleDTO[]> {
    const profile = await this.userService.searchProfilesBylolNickname(param);
    const result: ProfileBattleDTO[] = profile.map(({ ...rest }) => {
      return {
        ...rest,
        result: BattleResult.WIN, // todo
      };
    });
    return result;
  }
}
