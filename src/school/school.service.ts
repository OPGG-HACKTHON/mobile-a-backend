import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
import { School } from '@prisma/client';
import { SearchParam } from './school.param';

@Injectable()
export class SchoolService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private readonly SCHOOL_IMAGE_URL =
    'https://static.opggmobilea.com/school/img';

  private readonly SCHOOL_IMAGE_NAMES: string[] = [
    '경기고등학교.png',
    '고양예술고등학교.png',
    '대성고등학교.png',
    '동산고등학교.png',
    '마포고등학교.png',
    '보성고등학교.png',
    '분당중앙고등학교.png',
    '서울디자인고등학교.png',
    '서울예술고등학교.png',
    '선화고등학교.png',
    '양정고등학교.png',
    '인덕과학기술고등학교.png',
    '중앙고등학교.png',
    '풍생고등학교.png',
    '현대고등학교.png',
  ];

  private convertSchoolToSchool(
    row: string[],
    index: number,
  ): {
    id: string;
    name: string;
    division: string;
    educationOffice: string;
    address: string;
    imageUrl: string;
  } {
    const division = row[2];
    const imageNameIdx = index % this.SCHOOL_IMAGE_NAMES.length;
    const imageUrl =
      this.SCHOOL_IMAGE_URL + '/' + this.SCHOOL_IMAGE_NAMES[imageNameIdx];
    return {
      id: row[0],
      name: row[1],
      division: division,
      educationOffice: row[10],
      address: row[8],
      imageUrl: encodeURI(imageUrl),
    };
  }

  private rawRegionNameToRegionName(name: string): string {
    let rawRegion = name;
    if ('경기' === rawRegion) {
      rawRegion = '경기도';
    }
    if ('대전' === rawRegion) {
      rawRegion = '대전광역시';
    }
    return rawRegion;
  }

  private schoolAddressToRegion(address: string): string {
    const rawRegion = address.split(' ')[0];
    return this.rawRegionNameToRegionName(rawRegion);
  }

  private parseRegionsListBySchoolParam(param: string[][]): string[] {
    const result = [
      ...new Set(
        param.map((row, index) =>
          this.schoolAddressToRegion(
            this.convertSchoolToSchool(row, index).address,
          ),
        ),
      ),
    ].sort();
    return result;
  }

  async onApplicationBootstrap() {
    const schoolData = await got
      .get('https://static.opggmobilea.com/school/school.csv')
      .text();

    const rawSchools = schoolData
      .split('\n')
      .slice(1)
      .map((str) => str.split(','))
      .filter((row) => row.length > 1);
    const regionNames = this.parseRegionsListBySchoolParam(rawSchools);
    for (const name of regionNames) {
      await this.prisma.region.upsert({
        where: {
          name: name,
        },
        update: {},
        create: {
          name: name,
        },
      });
    }

    const regions = await this.prisma.region.findMany();
    const regionNameToIdMap: Map<string, number> = new Map();
    regions.forEach((region) => regionNameToIdMap.set(region.name, region.id));

    const inputSchools = rawSchools.map((raw, index) => {
      const row = this.convertSchoolToSchool(raw, index);
      return {
        id: row.id,
        name: row.name,
        division: row.division,
        educationOffice: row.educationOffice,
        address: row.address,
        regionId: regionNameToIdMap.get(
          this.schoolAddressToRegion(row.address),
        ),
        imageUrl: row.imageUrl,
      };
    });
    const upsertPromises = inputSchools.map((inputSchool) => {
      return this.prisma.school.upsert({
        where: {
          id: inputSchool.id,
        },
        create: { ...inputSchool },
        update: { imageUrl: inputSchool.imageUrl },
      });
    });
    await Promise.all(upsertPromises);
  }

  async getSchoolListBySearchParamOptionalDivision(
    param: SearchParam,
  ): Promise<School[]> {
    return await this.prisma.school.findMany({
      take: 50,
      where: {
        name: {
          contains: param.searchWord,
        },
        division: param.division,
      },
    });
  }

  async getSchoolById(id: string): Promise<School> {
    return await this.prisma.school.findUnique({
      where: {
        id: id,
      },
    });
  }
}
