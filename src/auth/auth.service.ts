import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  private readonly GOOGLE_AUTHFROM = 'google';

  async signUp(param: SignUpParam): Promise<ProfileWithSchoolDTO> {
    switch (param.authFrom) {
      case 'google':
        await this.validateGoogleTokenEmailAndInputEmail(
          param.accesstoken,
          param.email,
        );
        break;
      case 'apple':
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
      'google',
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
      case 'google':
        result = await this.googleLoginByLoginParam(param);
        break;
      case 'apple':
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
    const authFrom = 'google';
    const { email, id_token } = req.user;
    // const userInfo = await this.googleAuthService.getUser(id_token);
    const userInfo = await this.googleAuthService.verify(id_token);

    if (userInfo['email_verified'] && userInfo['email'] == email) {
      const token = await this.getTokenByGoogleTicketPayload(id_token);
      const user = await this.userService.findUserByAuthFromAndEmail(
        authFrom,
        email,
      );

      // 유저가 존재하지 않는 경우
      if (!user) {
        return {
          message: '유저 정보가 없습니다. 회원가입을 진행합니다.',
          authFrom: authFrom,
          email: email,
          accessToken: token,
        };
      } else {
        // 유저 존재 시 토큰을 디비에 담습니다.
        const userId = user.id;
        const userToken = await this.createToken(userId, authFrom, token);
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
}
