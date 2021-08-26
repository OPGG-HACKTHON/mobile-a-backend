import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from './user.types';
import { UserDTO } from '../common/dto/user.dto';
import { SignUpParam } from 'src/auth/auth-signup.param';
import { LOLService } from '../lol/lol.service';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lolService: LOLService,
  ) {}
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
  async isUserExist(authFrom: string, email: string) {
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

  // 유저 데이터 저장
  async createUser(param: SignUpParam) {
    // check user exist
    const isUserExist = await this.isUserExist(param.authFrom, param.email);

    // 유저가 존재하지 않을 경우
    if (!isUserExist) {
      const lolAccountId = await this.lolService.upsertLOLAccountByLOLName(
        param.LOLNickName,
      );

      return await this.prisma.user.create({
        data: {
          authFrom: param.authFrom,
          email: param.email,
          LOLAccountId: lolAccountId,
          schoolId: param.schoolId,
        },
      });
    } else {
      // 유저가 존재하는 경우
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: '이미 가입된 유저입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
