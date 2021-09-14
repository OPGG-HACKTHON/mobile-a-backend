import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import got from 'got';
import { TitleDTO } from './title.dto';
import { TitleLogDTO, TitleStatus } from './title-log.dto';

@Injectable()
export class TitleService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private readonly LOLCATEGORY_URL =
    'https://static.opggmobilea.com/lolcategory/lolcategory.txt';

  private readonly LOLCATEGORY_BOOLEAN_DATATYPE_FIELDS = [
    'firstBloodKill',
    'firstTowerKill',
    'gameEndedInEarlySurrender',
  ];

  private readonly DEFAULT_EXPOSURE_TITLES = [
    '전사',
    '마법사',
    '도란링',
    '도란검',
    '즐겜러',
    '롤린이',
    '모범생',
  ];

  async onApplicationBootstrap() {
    await this.setupLOLSummaryElement();
    await this.setupDefaultTitleInSchool();
  }

  async setupLOLSummaryElement(): Promise<void> {
    const createdTitles = await this.prisma.lOLSummaryElement.findMany({});
    if (!createdTitles.length) {
      const titleRaws = await got.get(this.LOLCATEGORY_URL).text();
      const titles = titleRaws.split('\n').map((row) => row.split('/'));
      const updateOrCreateTitles = titles.map((row) => {
        const LOLMatchFieldName = row[0];
        const calculateType = row[1];
        const exposureName = row[2];
        const LOLMatchFieldCategory = row[3];
        const LOLMatchFieldKoName = row[4];
        let LOLMatchFieldDataType = undefined;
        if (
          this.LOLCATEGORY_BOOLEAN_DATATYPE_FIELDS.includes(LOLMatchFieldName)
        ) {
          LOLMatchFieldDataType = 'Boolean';
        }
        return {
          LOLMatchFieldName,
          calculateType,
          exposureName,
          LOLMatchFieldCategory,
          LOLMatchFieldKoName,
          LOLMatchFieldDataType: LOLMatchFieldDataType,
          sortType: 'DESC',
        };
      });
      await this.prisma.lOLSummaryElement.createMany({
        data: updateOrCreateTitles,
      });
    }
  }

  async setupDefaultTitleInSchool(): Promise<void> {
    const rows = await this.prisma.titleInSchool.findMany({
      where: {
        exposureTitle: {
          in: this.DEFAULT_EXPOSURE_TITLES,
        },
      },
    });
    const existTitles = rows.map((row) => row.exposureTitle);

    const needCreate = this.DEFAULT_EXPOSURE_TITLES.filter(
      (defaultTitle) => !existTitles.includes(defaultTitle),
    );

    await this.prisma.titleInSchool.createMany({
      data: needCreate.map((defaultTitle) => {
        return { exposureTitle: defaultTitle };
      }),
    });
  }

  async getTitlesByUserId(userId: number): Promise<TitleDTO[]> {
    const titles = await this.prisma.titleInSchool.findMany({
      take: 15,
      where: {
        OR: [
          {
            titleholderUserId: userId,
          },
          {
            titleholderUserId: null,
          },
        ],
      },
    });
    const results: TitleDTO[] = titles.map(({ id, exposureTitle }) => {
      return { id: id, exposureName: exposureTitle };
    });
    return results;
  }

  async getTitleLogsByUserId(userId: number): Promise<TitleLogDTO[]> {
    const titleLogs = await this.prisma.titleInSchoolLog.findMany({
      take: 15,
      where: {
        OR: [{ titleholderUserId: userId }, { prevUserId: userId }],
      },
      include: {
        TitleInSchool: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    const results: TitleLogDTO[] = titleLogs.map((titleLog) => {
      return {
        id: titleLog.id,
        exposureName: titleLog.TitleInSchool.exposureTitle,
        titleStatus:
          titleLog.titleholderUserId === userId
            ? TitleStatus.GET
            : TitleStatus.LOSE,
        createdAt: titleLog.createdAt,
      };
    });
    return results;
  }

  async setUserTitleByTitleId(
    userId: number,
    titleId: number,
  ): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        selectedTitleId: titleId,
      },
    });
    return true;
  }
}
