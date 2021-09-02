import { Injectable } from '@nestjs/common';
import { ProfileDTO } from '../user/user-profile.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

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

  async searchProfilesBylolNickname(param: string): Promise<ProfileDTO[]> {
    return await this.userService.searchProfilesBylolNickname(param);
  }
}
