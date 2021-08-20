import { initSchema } from '../commn/schemaUtil';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TitleService } from '../../src/title/title.service';
import { TitleModule } from '../../src/title/title.module';

describe('title data test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const titleService = new TitleService(prismaService);
  beforeAll(async () => {
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

  afterAll(() => {
    app.close();
    prismaService.$disconnect();
  });

  it('school data test', async () => {
    const countTitles = await prismaService.lOLSummaryElement.count();
    expect(countTitles).toBe(26);
  });
});