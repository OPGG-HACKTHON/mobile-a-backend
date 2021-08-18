import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
import { User } from '@prisma/client';

@Injectable()
export class TitleService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const createdTitles = await this.prisma.lOLSummaryElement.findMany({});
    if (!createdTitles.length) {
      const titleRaws = await got
        .get('https://static.opggmobilea.com/lolcategory/lolcategory.txt')
        .text();
      const titles = titleRaws.split('\n').map((row) => row.split('/'));
      const updateOrCreateTitles = titles.map((row) => {
        const LOLMatchFieldName = row[0];
        const calculateType = row[1];
        const exposureName = row[2];
        return {
          LOLMatchFieldName,
          calculateType,
          exposureName,
          sortType: 'DESC',
        };
      });
      await this.prisma.lOLSummaryElement.createMany({
        data: updateOrCreateTitles,
      });
    }
  }
}
