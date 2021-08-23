import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpParam } from './auth-signup.param';
import { User } from '@prisma/client';
import { LOLService } from '../lol/lol.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lolService: LOLService,
  ) {}

  async signUp(param: SignUpParam): Promise<User> {
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
}
