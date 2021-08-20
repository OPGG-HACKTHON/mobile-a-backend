import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDTO } from './auth-signup.dto';
import { User } from '@prisma/client';
import { LOLService } from '../lol/lol.service';
import * as appleSignin from 'apple-signin';
import path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lolService: LOLService,
  ) {}

  async signUp(param: SignUpDTO): Promise<User> {
    const lolAccountId = await this.lolService.upsertLOLAccountByLOLName(
      param.LOLNickName,
    );
    return await this.prisma.user.create({
      data: {
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
      return 'No user from google';
    }

    const findUser = await this.prisma.user.findFirst({
      where: {
        email: {
          contains: req.user.email,
        },
      },
    });

    if (!findUser) {
      return {
        message: 'google',
        email: req.user.email,
      };
    }

    return { accessToken: req.user.accessToken };
  }

  /**
   * @Apple
   */
  async appleLogin(payload: any): Promise<any> {
    const clientSecret = appleSignin.getClientSecret({
      clientID: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyIdentifier: process.env.APPLE_KEY_ID,
      privateKeyPath: path.join(__dirname, '/secrets/AuthKey_ZC25JZUJ4G.p8'),
    });

    const tokens = await appleSignin.getAuthorizationToken(payload.code, {
      clientID: process.env.APPLE_CLIENT_ID,
      clientSecret: clientSecret,
      redirectUri: 'https://auth.example.com/auth/apple',
    });

    if (!tokens.id_token) {
      console.log('no token.id_token');
      throw new ForbiddenException();
    }

    console.log('tokens', tokens);

    // TODO: 첫 애플 로그인 이후에 유저데이터를 보내주지 않음, 유저데이터를 어디에다가 저장해놔야함.

    const data = await appleSignin.verifyIdToken(tokens.id_token);
    return { data, tokens };
  }
}
