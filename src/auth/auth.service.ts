import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDTO } from './auth-signup.dto';
import { User } from '@prisma/client';
import { LOLService } from '../lol/lol.service';
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
}
