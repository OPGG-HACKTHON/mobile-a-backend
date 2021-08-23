import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
import { School } from '@prisma/client';

@Injectable()
export class SchoolService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    console.log('... 학교 데이터 로드 ...');
    const isSchoolExist = await this.prisma.school.findMany();

    if (isSchoolExist.length == 0) {
      console.log('... 학교 데이터 받아오는 중 ...');
      const schoolData = await got
        .get('https://static.opggmobilea.com/school/school.json')
        .json();
      const schoolDataJson = schoolData['records'];

      const schoolInputList = schoolDataJson.map((schoolJson) => ({
        name: schoolJson['학교명'],
        division: schoolJson['학교급구분'],
        region: schoolJson['시도교육청명'],
        address: schoolJson['소재지도로명주소'],
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createMany = await this.prisma.school.createMany({
        data: schoolInputList,
        skipDuplicates: true, // Skip 'Bobo'
      });
    } else {
      console.log('... 학교 데이터가 이미 존재 ...');
    }
  }

  async getSchoolListBySearchParam(param: string): Promise<School[]> {
    return await this.prisma.school.findMany({
      where: {
        name: {
          contains: param,
        },
      },
    });
  }

  async getSchoolById(id: number): Promise<School> {
    return await this.prisma.school.findUnique({
      where: {
        id: id,
      },
    });
  }
}
