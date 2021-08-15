import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDTO } from './auth-signup.dto';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(param: SignUpDTO): Promise<User> {
    /* // todo
       const LOLAccountId = LOLAccountService.getIdByName(param.LOLNickName)
    */

    const LOLAccount = await this.prisma.lOLAccount.findFirst({
      where: {
        name: param.LOLNickName,
      },
    });

    return await this.prisma.user.create({
      data: {
        email: param.email,
        LOLAccountId: LOLAccount.id,
        schoolId: param.schoolId,
      },
    });
  }
}
