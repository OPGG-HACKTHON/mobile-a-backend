import { SchoolService } from '../../src/school/school.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SchoolModule } from '../../src/school/school.module';
import { initSchema } from '../commn/schemaUtil';

describe('clear school data', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const schoolService = new SchoolService(prismaService);
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SchoolModule],
    })
      .overrideProvider(SchoolService)
      .useValue(schoolService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await initSchema(prismaService);
  });

  it('test', () => {
    expect(1).toBe(1);
  });
});
