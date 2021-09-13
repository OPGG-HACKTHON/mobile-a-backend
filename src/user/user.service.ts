import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileDTO } from './user-profile.dto';
import { UserDTO } from '../common/dto/user.dto';
import { SignUpParam } from 'src/auth/auth-signup.param';
import { LOLService } from '../lol/lol.service';
import { User } from '@prisma/client';
import { UserCreateParam } from './user-create.param';
import { ProfileWithSchoolDTO } from './user-profileWithSchool.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lolService: LOLService,
  ) {}
  private readonly DOMAIN_URL = 'https://static.opggmobilea.com/';
  private readonly PROFILE_IMAGE_URL =
    this.DOMAIN_URL + 'dragontail-11.18.1/11.18.1/img/profileicon';

  private getProfileImageUrl(profileIconId: number) {
    return this.PROFILE_IMAGE_URL + '/' + profileIconId.toString() + '.png';
  }

  async getProfileWithSchoolByUserId(
    userId: number,
  ): Promise<ProfileWithSchoolDTO> {
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
        School: true,
      },
    });
    if (!user.LOLAccountId) {
      throw new Error('lol 계정이 존재하지 않습니다.');
    }
    const { profileIconId, summonerLevel, name } = user.LOLAccount;
    const { tier, rank, leaguePoints } = user.LOLAccount.LOLTier;
    return {
      id: userId,
      lol: {
        name,
        profileIconId,
        profileIconImageUrl: this.getProfileImageUrl(profileIconId),
        summonerLevel,
        tierInfo: { tier, rank, leaguePoints },
      },
      school: {
        id: user.School.id,
        name: user.School.name,
        division: user.School.division,
        regionId: user.School.regionId,
        address: user.School.address,
      },
      title: {
        id: 123,
        exposureName: '리신 장인',
      },
    };
  }

  async getProfileByUserId(userId: number): Promise<ProfileDTO> {
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
    const { profileIconId, summonerLevel, name } = user.LOLAccount;
    const { tier, rank, leaguePoints } = user.LOLAccount.LOLTier;
    return {
      id: userId,
      lol: {
        name,
        profileIconId,
        profileIconImageUrl: this.getProfileImageUrl(profileIconId),
        summonerLevel,
        tierInfo: { tier, rank, leaguePoints },
      },
      title: {
        id: 123,
        exposureName: '리신 장인',
      },
    };
  }

  // check user exist
  async findUserByAuthFromAndEmail(authFrom: string, email: string) {
    return await this.prisma.user.findFirst({
      where: {
        authFrom: authFrom,
        email: email,
      },
    });
  }

  async getUserById(id: number): Promise<UserDTO> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  // 유저 데이터 저장
  async createUser(param: UserCreateParam): Promise<User> {
    // check user exist
    const isUserExist = await this.findUserByAuthFromAndEmail(
      param.authFrom,
      param.email,
    );

    // 유저가 존재하지 않을 경우
    if (!isUserExist) {
      await this.lolService.validateLOLNickname(param.LOLNickName);
      const lolAccountId = await this.lolService.upsertLOLAccountByLOLName(
        param.LOLNickName,
      );
      const result = await this.prisma.user.create({
        data: {
          authFrom: param.authFrom,
          email: param.email,
          LOLAccountId: lolAccountId,
          schoolId: param.schoolId,
        },
      });
      // todo sync logic to be event
      await this.lolService.syncAllLOLData(lolAccountId, result.id);
      return result;
    } else {
      // 유저가 존재하는 경우
      throw new BadRequestException('이미 가입된 유저입니다.');
    }
  }

  async searchProfilesBylolNickname(param: string): Promise<ProfileDTO[]> {
    const users = await this.prisma.user.findMany({
      where: {
        LOLAccount: {
          name: {
            contains: param,
            mode: 'insensitive',
          },
        },
      },
    });
    const results: ProfileDTO[] = [];
    for (const user of users) {
      const profile = await this.getProfileByUserId(user.id);
      results.push(profile);
    }
    return results;
  }
}
