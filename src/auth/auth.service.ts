import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDTO } from './auth-signup.dto';
import { User } from '@prisma/client';
import { LOLService } from '../lol/lol.service';
import * as appleSignin from 'apple-signin';
import path from 'path';
import { UserService } from 'src/user/user.service';
import { GoogleAuthService } from './passport/google-auth.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lolService: LOLService,
    private readonly userService: UserService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async signUp(param: SignUpDTO): Promise<User> {
    // TODO : user validate (module)

    const lolAccountId = await this.lolService.upsertLOLAccountByLOLName(
      param.LOLNickName,
    );

    // TODO : header.accessToken validate

    return await this.prisma.user.create({
      data: {
        authFrom: param.authFrom,
        email: param.email,
        LOLAccountId: lolAccountId,
        schoolId: param.schoolId,
      },
    });
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

    // TODO 1. 구글쪽에 accessToken 보내서 클라이언트에 대한 정보 가져오기 (ㅇㅇ: -> 진행, ㄴㄴ: 에러)
    // -> {data} 값 확인
    const tokenValidate = await this.googleAuthService.getUser(accessToken);
    if (tokenValidate.verified_email) {
      const userValidate = await this.userService.userValidate(authFrom, email);

      if (!userValidate) {
        return {
          message: '유저 정보가 없습니다. 회원가입을 진행합니다.',
          authFrom: authFrom,
          email: email,
          accessToken: accessToken,
        };
      }

      return { accessToken: req.user.accessToken };
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
