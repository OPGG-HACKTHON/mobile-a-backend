import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getSchoolData() {
    const isSchoolExist = this.prisma.school.findMany();

    // if (!isSchoolExist) {
    const schoolData = await got.get(
      'https://static.opggmobilea.com/school/school.json',
    );
    const schoolDataJson = JSON.parse(schoolData.body)['records'];

    for (const item in schoolDataJson) {
      await this.prisma.school.create({
        data: {
          name: schoolDataJson[item]['학교명'],
          division: schoolDataJson[item]['학교급구분'],
          region: schoolDataJson[item]['시도교육청명'],
        },
      });
    }
  }
}
