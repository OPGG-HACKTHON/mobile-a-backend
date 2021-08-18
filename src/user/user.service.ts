import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getSchoolData() {
    return 'test';
  }
}
