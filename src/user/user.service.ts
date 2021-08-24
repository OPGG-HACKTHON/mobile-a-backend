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

  // check user exist
  async isUserExistValidate(authFrom: string, email: string) {
    const findUser = await this.prisma.user.findFirst({
      where: {
        authFrom: authFrom,
        email: email,
      },
    });

    if (!findUser) {
      return false;
    } else {
      return findUser.id;
    }
  }

  async getUserById(id: number): Promise<UserDTO> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  // TODO. 유저 토큰 조회해서 가져오기
  async getUserTokenByAuthAndEmail(authFrom: string, email: string) {
    const user = this.prisma.user.findFirst({
      where: {
        authFrom: authFrom,
        email: email,
      },
      include: {
        Token: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const token = user.Token;
    return token;
  }

  // TODO. 유저 토큰 저장 (token, userId)
  // -> create, 현재시간 + 1년
  async createUserToken(userId: number, Token: string) {
    const expireAt = new Date();
    expireAt.setFullYear(expireAt.getFullYear() + 1);

    return await this.prisma.token.create({
      data: {
        Token: Token,
        userId: userId,
        expireAt: expireAt,
      },
    });
  }
}
