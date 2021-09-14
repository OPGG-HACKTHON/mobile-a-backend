import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpParam } from './auth-signup.param';
import { UserService } from '../user/user.service';
import { GoogleAuthService } from './passport/google-auth.service';
import { User } from '@prisma/client';
import { LoginParam } from './auth-login.param';
import { LoginDTO } from './auth-login.dto';
import { TokenDTO } from './auth-token.dto';
import { UserDTO } from '../common/dto/user.dto';
import { ProfileWithSchoolDTO } from 'src/user/user-profileWithSchool.dto';
import { LOLTierParam, SignUpRandomParam } from './auth-signup-random.param';
import { LOLService } from '../lol/lol.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly lolService: LOLService,
  ) {}

  private readonly GOOGLE_AUTHFROM = 'google';
  private readonly APPLE_AUTHFROM = 'apple';

  async signUp(param: SignUpParam): Promise<ProfileWithSchoolDTO> {
    switch (param.authFrom) {
      case this.GOOGLE_AUTHFROM:
        await this.validateGoogleTokenEmailAndInputEmail(
          param.accesstoken,
          param.email,
        );
        break;
      case this.APPLE_AUTHFROM:
      // console.log('todo');
      default:
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: '유효하지 않은 가입 경로 입니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
    }
    const createUser = await this.userService.createUser(param);
    const result = await this.userService.getProfileWithSchoolByUserId(
      createUser.id,
    );

    return result;
  }

  private async validateGoogleTokenEmailAndInputEmail(
    token: string,
    email: string,
  ): Promise<void> {
    try {
      const googleUser = await this.googleAuthService.verify(token);
      if (!googleUser['email_verified']) {
        throw new HttpException(
          {
            status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
            error: '유효하지 않은 토큰입니다.',
          },
          HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        );
      }
      if (googleUser['email'] != email) {
        throw new HttpException(
          {
            status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
            error: '토큰 정보의 이메일과 입력한 이메일이 다릅니다.',
          },
          HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        );
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'google 토큰인증이 동작하지 않습니다.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async googleLoginByLoginParam(param: LoginParam): Promise<LoginDTO> {
    const googleUser = await this.googleAuthService.verify(param.accesstoken);
    if (!googleUser['email_verified']) {
      throw new HttpException(
        {
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: '유효하지 않은 토큰입니다.',
        },
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }
    const user = await this.userService.findUserByAuthFromAndEmail(
      this.GOOGLE_AUTHFROM,
      googleUser['email'],
    );
    if (!user) {
      return {
        message: '유저 정보가 없습니다. 회원가입을 진행합니다.',
        authFrom: param.authFrom,
        email: googleUser.email,
        accessToken: param.accesstoken,
      };
    }
    const resultToken = await this.upsertUserToken(
      user.id,
      this.GOOGLE_AUTHFROM,
      param.accesstoken,
    );
    return {
      message: '이미 가입된 유저입니다. 로그인이 완료되었습니다.',
      accessToken: resultToken.token,
    };
  }

  async upsertUserToken(
    userId: number,
    authFrom: string,
    token: string,
  ): Promise<TokenDTO> {
    const inputToken = this.OauthTokenToToken(authFrom, token);
    return await this.prisma.token.upsert({
      where: {
        token: inputToken,
      },
      update: {},
      create: {
        token: inputToken,
        userId: userId,
      },
    });
  }

  async login(param: LoginParam): Promise<LoginDTO> {
    let result: LoginDTO;
    switch (param.authFrom) {
      case this.GOOGLE_AUTHFROM:
        result = await this.googleLoginByLoginParam(param);
        break;
      case this.APPLE_AUTHFROM:
      // console.log('todo');
      default:
        throw new HttpException(
          {
            status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
            error: '유효하지 않은 가입 경로 입니다.',
          },
          HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        );
    }
    return result;
  }

  /**
   * @Google
   */
  async googleLogin(req) {
    if (!req.user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '해당 구글 유저가 존재하지 않습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const { email, id_token } = req.user;
    // const userInfo = await this.googleAuthService.getUser(id_token);
    const userInfo = await this.googleAuthService.verify(id_token);

    if (userInfo['email_verified'] && userInfo['email'] == email) {
      const token = await this.getTokenByGoogleTicketPayload(id_token);
      const user = await this.userService.findUserByAuthFromAndEmail(
        this.GOOGLE_AUTHFROM,
        email,
      );

      // 유저가 존재하지 않는 경우
      if (!user) {
        return {
          message: '유저 정보가 없습니다. 회원가입을 진행합니다.',
          authFrom: this.GOOGLE_AUTHFROM,
          email: email,
          accessToken: token,
        };
      } else {
        // 유저 존재 시 토큰을 디비에 담습니다.
        const userId = user.id;
        const userToken = await this.createToken(
          userId,
          this.GOOGLE_AUTHFROM,
          token,
        );
        return {
          message: '이미 가입된 유저입니다. 로그인을 진행합니다.',
          accessToken: userToken,
        };
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: '인증되지 않은 유저입니다.',
        },
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }
  }

  private OauthTokenToToken(authFrom: string, token: string): string {
    return authFrom + '_' + token;
  }

  /**
   * @Token
   * @desc Google sub 값을 리턴합니다. ( id_token을 이용해 받은 구글 sub값 )
   */
  async getTokenByGoogleTicketPayload(token: string) {
    const user = await this.googleAuthService.verify(token);
    return user['sub'];
  }

  /**
   * @Token
   * @desc 토큰을 생성합니다. ( id_token을 이용해 받은 구글 sub값 )
   */
  async createToken(
    userId: number,
    authFrom: string,
    token: string,
  ): Promise<TokenDTO> {
    const inputToken = this.OauthTokenToToken(authFrom, token);
    return await this.prisma.token.create({
      data: {
        token: inputToken,
        userId: userId,
      },
    });
  }

  /**
   * @Token
   * @desc internal 토큰을 통해 유저를 조회합니다.
   * @issue id_token을 이용해 sub값 활용 예정
   */
  async getUserByToken(accessToken: string): Promise<ProfileWithSchoolDTO> {
    const userToken = await this.prisma.token.findUnique({
      where: {
        token: accessToken,
      },
      include: {
        User: {
          include: {
            School: true,
          },
        },
      },
    });
    if (!userToken) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: '존재하지 않는 토큰입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.userService.getProfileWithSchoolByUserId(
      userToken.userId,
    );
    return result;
  }

  async signUpRandomUser(
    param: SignUpRandomParam,
  ): Promise<ProfileWithSchoolDTO> {
    const seletedTier = LOLTierParam[param.tier] || this.selectRandomTier();
    const seletedSommonerName =
      await this.lolService.getRandomSummonerNameByTier(seletedTier);
    await this.validateRandomSummonerName(seletedSommonerName);
    const createUserParam = {
      authFrom: 'google',
      email: Date.now().toString() + '@' + 'test.com',
      LOLNickName: seletedSommonerName,
      schoolId: param.schoolId,
    };
    const createUser = await this.userService.createUser(createUserParam);
    const result = await this.userService.getProfileWithSchoolByUserId(
      createUser.id,
    );

    return result;
  }

  async validateRandomSummonerName(summonerName?: string): Promise<void> {
    //
    if (!summonerName) {
      throw new InternalServerErrorException(
        '다시 시도해주세요. (LOL 서버로부터 소환사명을 가져올수 없습니다.)',
      );
    }

    const findSommoner = await this.prisma.lOLAccount.findFirst({
      where: {
        name: summonerName,
      },
    });
    if (findSommoner) {
      throw new InternalServerErrorException(
        '다시 시도해주세요. (이미 생성된 소환사 입니다.)',
      );
    }
    await this.lolService.validateLOLNickname(summonerName);
  }

  selectRandomTier(): LOLTierParam {
    const tierArr = [
      LOLTierParam.DIAMOND,
      LOLTierParam.PLATINUM,
      LOLTierParam.GOLD,
      LOLTierParam.SILVER,
      LOLTierParam.BRONZE,
      LOLTierParam.IRON,
    ];
    const idx = Math.floor(Math.random() * 6);
    return tierArr[idx];
  }
}
