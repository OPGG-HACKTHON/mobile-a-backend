import { initSchema } from '../commn/schemaUtil';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SchoolService } from '../../src/school/school.service';
import { SchoolModule } from '../../src/school/school.module';
import { RegionModule } from '../../src/region/region.module';
import { RegionService } from '../../src/region/region.service';
import { PrismaModule } from '../../src/prisma/prisma.module';

describe('school data test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const regionService = new RegionService(prismaService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [SchoolModule, RegionModule, PrismaModule],
      providers: [SchoolService, RegionService, PrismaService],
    })
      .overrideProvider(RegionService)
      .useValue(regionService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  afterAll(() => {
    prismaService.$disconnect();
  });

  it('region data test', async () => {
    const countRegionData = await prismaService.region.count();
    expect(countRegionData).toBe(17);
  });

  it('regions all e2e test ', async () => {
    const res = await request(app.getHttpServer())
      .get(encodeURI('/regions'))
      .set('Accept', 'application/json')
      .type('application/json');
    // console.log(res.body);
    expect(res.body.length).toBe(17);
    expect(res.body[0].id).toBe(1);
    expect(res.body[0].name).toBe('강원도');
    expect(res.body[16].id).toBe(17);
    expect(res.body[16].name).toBeTruthy();
  });
});
