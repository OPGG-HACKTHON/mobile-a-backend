import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpParam } from './auth-signup.param';
import { LOLService } from '../lol/lol.service';
import { UserService } from '../user/user.service';
import { GoogleAuthService } from './passport/google-auth.service';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lolService: LOLService,
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async signUp(param: SignUpParam): Promise<User> {
    // check user exist
    const isUserExist = await this.userService.isUserExist(
      param.authFrom,
      param.email,
    );
    // 유저가 존재하지 않을 경우
    if (!isUserExist) {
      const lolAccountId = await this.lolService.upsertLOLAccountByLOLName(
        param.LOLNickName,
      );

      return await this.userService.createUser(param, lolAccountId);
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
      const isUserExist = await this.userService.isUserExist(authFrom, email);

      // 유저가 존재하지 않는 경우
      if (!isUserExist) {
        return {
          message: '유저 정보가 없습니다. 회원가입을 진행합니다.',
          authFrom: authFrom,
          email: email,
          accessToken: accessToken,
        };
      } else {
        // 유저 존재 시 토큰을 디비에 담습니다.
        const userId = isUserExist;
        const userToken = await this.userService.createUserToken(
          userId,
          accessToken,
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
}
