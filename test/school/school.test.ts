import { initSchema } from '../commn/schemaUtil';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SchoolService } from '../../src/school/school.service';
import { SchoolModule } from '../../src/school/school.module';

describe('school data test', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const schoolService = new SchoolService(prismaService);
  beforeAll(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [SchoolModule],
    })
      .overrideProvider(SchoolService)
      .useValue(schoolService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
    prismaService.$disconnect();
  });

  it('school data test', async () => {
    const countSchoolData = await prismaService.school.count();
    expect(countSchoolData).toBe(500);
  });

  it('search schools ', async () => {
    const res = await request(app.getHttpServer())
      .get(encodeURI('/schools/search/서울'))
      .set('Accept', 'application/json')
      .type('application/json');

    expect(res.body[0].id).toBeTruthy();
    expect(res.body[0].name).toBeTruthy();
    expect(res.body[0].division).toBeTruthy();
    expect(res.body[0].region).toBeTruthy();
    expect(res.body[0].address).toBeTruthy();
  });
});
