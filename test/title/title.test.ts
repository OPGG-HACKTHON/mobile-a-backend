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
});
