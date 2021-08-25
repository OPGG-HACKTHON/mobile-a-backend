import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
import { School, Region } from '@prisma/client';
import { SchoolParam, SearchParam } from './school.param';

@Injectable()
export class SchoolService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private convertSchoolToSchool(row: string[]): {
    id: string;
    name: string;
    division: string;
    educationOffice: string;
    address: string;
  } {
    return {
      id: row[0],
      name: row[1],
      division: row[2],
      educationOffice: row[10],
      address: row[8],
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
}
