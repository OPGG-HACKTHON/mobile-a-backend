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
    // school create too heavy - beforeEach => beforeAll
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

  afterAll(async () => {
    app.close();
    await prismaService.$disconnect();
  });

  it('school data test', async () => {
    const countSchoolData = await prismaService.school.count();
    expect(countSchoolData).toBe(11964);
  });

  it('search schools ', async () => {
    const res = await request(app.getHttpServer())
      .get(encodeURI('/schools/search?searchWord=서울'))
      .set('Accept', 'application/json')
      .type('application/json');
    // console.log(res.body);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id).toBeTruthy();
    expect(res.body[0].name).toBeTruthy();
    expect(res.body[0].division).toBeTruthy();
    expect(res.body[0].regionId).toBeTruthy();
    expect(res.body[0].address).toBeTruthy();
  });

  it('search schools with division ', async () => {
    const res = await request(app.getHttpServer())
      .get(
        encodeURI(
          '/schools/search?searchWord=부일외국어고등학교&division=고등학교',
        ),
      )
      .set('Accept', 'application/json')
      .type('application/json');

    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBeTruthy();
    expect(res.body[0].name).toBeTruthy();
    expect(res.body[0].division).toBeTruthy();
    expect(res.body[0].regionId).toBeTruthy();
    expect(res.body[0].address).toBeTruthy();
    expect(res.body[0].imageUrl).toBe(
      encodeURI(
        'https://static.opggmobilea.com/school/img/경기고등학교.png',
      ),
    );
  });
});
