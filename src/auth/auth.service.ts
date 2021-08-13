import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';
@Injectable()
export class AuthService {
  googleLogin(req) {
    if (!req.user) {
      return '유저가 존재하지 않습니다.';
    }

    return {
      message: '구글 로그인 성공',
      user: req.user,
    };
  }
}
