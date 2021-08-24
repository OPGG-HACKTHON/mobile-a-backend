import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from './user.types';
import { UserDTO } from '../common/dto/user.dto';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly DOMAIN_URL = 'https://static.opggmobilea.com/';
  private readonly PROFILE_IMAGE_URL =
    this.DOMAIN_URL + 'dragontail-11.15.1/11.15.1/img/profileicon';

  private getProfileImageUrl(profileIconId: number) {
    return this.PROFILE_IMAGE_URL + '/' + profileIconId.toString() + '.png';
  }

  async getProfileByUserId(userId: number): Promise<Profile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        LOLAccount: {
          include: {
            LOLTier: true,
          },
        },
      },
    });
    if (!user.LOLAccountId) {
      throw new Error('lol 계정이 존재하지 않습니다.');
    }
    const { profileIconId, summonerLevel } = user.LOLAccount;
    const { tier, rank, leaguePoints } = user.LOLAccount.LOLTier;
    return {
      id: userId,
      lol: {
        profileIconId,
        profileIconImageUrl: this.getProfileImageUrl(profileIconId),
        summonerLevel,
        tierInfo: { tier, rank, leaguePoints },
      },
    };
  }

  async userValidate(authFrom: string, email: string) {
    const findUser = await this.prisma.user.findFirst({
      where: {
        authFrom: authFrom,
        email: email,
      },
    });

    if (!findUser) {
      return false;
    } else {
      return true;
    }
  }

  async getUserById(id: number): Promise<UserDTO> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
