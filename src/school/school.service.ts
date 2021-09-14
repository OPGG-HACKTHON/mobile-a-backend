import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
import { School } from '@prisma/client';
import { SearchParam } from './school.param';
import { LOLService } from '../lol/lol.service';

@Injectable()
export class SchoolService implements OnApplicationBootstrap {
  constructor(
    private prisma: PrismaService,
    private readonly lolService: LOLService,
  ) {}

  private convertSchoolToSchool(row: string[]): {
    id: string;
    name: string;
    division: string;
    educationOffice: string;
    address: string;
    imageUrl: string;
  } {
    const division = row[2];
    let imageUrl = '';
    if (division === '초등학교') {
      imageUrl =
        'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/profileicon/3458.png';
    } else if (division === '중학교') {
      imageUrl =
        'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/profileicon/3457.png';
    } else if (division === '고등학교') {
      imageUrl =
        'https://static.opggmobilea.com/dragontail-11.15.1/11.15.1/img/profileicon/3456.png';
    }
    return {
      id: row[0],
      name: row[1],
      division: division,
      educationOffice: row[10],
      address: row[8],
      imageUrl: imageUrl,
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
        param.map((row) =>
          this.schoolAddressToRegion(this.convertSchoolToSchool(row).address),
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

    const inputSchools = rawSchools.map((raw) => {
      const row = this.convertSchoolToSchool(raw);
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
    await this.prisma.school.createMany({
      data: inputSchools,
      skipDuplicates: true,
    });
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

  async updateSchoolTotalPoint(LOLNickName: string, schoolId: string) {
    const userTier = await this.lolService.getLOLTierByLOLId(LOLNickName);
    const pointOfUser = await this.lolService.getPointByTier(userTier);
    const pointOfSchool = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
      },
      select: {
        totalPoint: true,
      },
    });
    const point = pointOfUser + pointOfSchool['totalPoint'];

    await this.prisma.school.update({
      where: {
        id: schoolId,
      },
      data: {
        totalPoint: point,
      },
    });
  }
}
