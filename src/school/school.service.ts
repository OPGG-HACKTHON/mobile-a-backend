import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';

@Injectable()
export class SchoolService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    console.log('... 학교 데이터 로드 ...');
    const isSchoolExist = await this.prisma.school.findMany();

    if (isSchoolExist.length == 0) {
      console.log('... 학교 데이터 받아오는 중 ...');
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
    } else {
      console.log('... 학교 데이터가 이미 존재 ...');
    }
  }
}
