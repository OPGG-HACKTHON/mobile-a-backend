import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpParam } from './auth-signup.param';
import { UserService } from '../user/user.service';
import { GoogleAuthService } from './passport/google-auth.service';
import { User } from '@prisma/client';
import { LoginParam } from './auth-login.param';
import { LoginDTO } from './auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async signUp(param: SignUpParam): Promise<User> {
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
    return await this.userService.createUser(param);
  }

  private async validateGoogleTokenEmailAndInputEmail(
    token: string,
    email: string,
  ): Promise<void> {
    try {
      const googleUser = await this.googleAuthService.getUser(token);
      if (!googleUser.verified_email) {
        throw new HttpException(
          {
            status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
            error: '유효하지 않은 토큰입니다.',
          },
          HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        );
      }
      if (googleUser.email != email) {
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
    const googleUser = await this.googleAuthService.getUser(param.accesstoken);
    if (!googleUser.verified_email) {
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
      googleUser.email,
    );
    if (!user) {
      return {
        message: '유저 정보가 없습니다. 회원가입을 진행합니다.',
        authFrom: param.authFrom,
        email: googleUser.email,
        accessToken: param.accesstoken,
      };
    }
    return {
      message: '이미 가입된 유저입니다. 로그인을 진행합니다.',
      accessToken: param.accesstoken,
    };
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
    const { email, accessToken } = req.user;
    const userInfo = await this.googleAuthService.getUser(accessToken);

    if (userInfo.verified_email && userInfo.email == email) {
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
          accessToken: accessToken,
        };
      } else {
        // 유저 존재 시 토큰을 디비에 담습니다.
        const userId = user.id;
        const userToken = await this.createUserToken(userId, accessToken);
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

  /**
   * @Token ( 1년 )
   */
  async createUserToken(userId: number, token: string) {
    const expireAt = new Date();
    expireAt.setFullYear(expireAt.getFullYear() + 1);

    return await this.prisma.token.create({
      data: {
        token: token,
        userId: userId,
        expireAt: expireAt,
      },
    });
  }

  async getUserByToken(token: string) {
    const userToken = await this.prisma.token.findUnique({
      where: {
        token: token,
      },
    });

    return await this.userService.getUserById(userToken.userId);
  }
}
