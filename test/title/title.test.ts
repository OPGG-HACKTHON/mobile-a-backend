import { initSchema } from '../commn/schemaUtil';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TitleService } from '../../src/title/title.service';
import { TitleModule } from '../../src/title/title.module';

describe('title data test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const titleService = new TitleService(prismaService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [TitleModule],
    })
      .overrideProvider(TitleService)
      .useValue(titleService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('title data test', async () => {
    const countTitles = await prismaService.lOLSummaryElement.count();
    expect(countTitles).toBe(26);
  });

  it('title firstBloodKill Boolean, kills Int LOLMatchFieldDataType test', async () => {
    const killlsField = await prismaService.lOLSummaryElement.findFirst({
      where: {
        LOLMatchFieldName: 'kills',
      },
    });
    expect(killlsField.LOLMatchFieldDataType).toBe('Int');

    const firstBloodKillField = await prismaService.lOLSummaryElement.findFirst(
      {
        where: {
          LOLMatchFieldName: 'firstBloodKill',
        },
      },
    );
    expect(firstBloodKillField.LOLMatchFieldDataType).toBe('Boolean');
  });

  it('check default title setup', async () => {
    const defaultTitles = await prismaService.titleInSchool.findMany();
    expect(defaultTitles.length).toBe(7);
    expect(defaultTitles[0].exposureTitle).toBe('전사');
    expect(defaultTitles[0].schoolId).toBeNull();
    expect(defaultTitles[0].titleholderUserId).toBeNull();

    expect(defaultTitles[6].exposureTitle).toBe('모범생');
    expect(defaultTitles[6].schoolId).toBeNull();
    expect(defaultTitles[6].titleholderUserId).toBeNull();
  });
});
