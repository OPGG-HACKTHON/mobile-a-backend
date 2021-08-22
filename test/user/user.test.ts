import { initSchema } from '../commn/schemaUtil';
import { UserModule } from '../../src/user/user.module';
import { UserService } from '../../src/user/user.service';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
//
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { LOLService } from '../../src/lol/lol.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { LOLModule } from '../../src/lol/lol.module';
describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const userService = new UserService(prismaService);
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, AuthModule, PrismaModule, LOLModule],
      providers: [UserService, AuthService, PrismaService, LOLService],
    })
      .overrideProvider(UserService)
      .useValue(userService)
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

  // same auth test
  it('create school,lolaccount,  /auth/signup test and get profile', async () => {
    await prismaService.school.create({
      data: {
        name: '가나다초등학교',
        division: '초딩',
        region: '서울',
        address: '어디선가',
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({ email: 'abc@abc.com', LOLNickName: 'kkangsan', schoolId: 1 });

    expect(res.statusCode).toBe(201);
    const { id, email, LOLAccountId, schoolId } = res.body;
    expect(id).toBe(1);
    expect(email).toBe('abc@abc.com');
    expect(LOLAccountId).toBeTruthy();
    expect(schoolId).toBe(1);
    // find profile
    const resProfile = await request(app.getHttpServer())
      .get('/users/1/profile')
      .set('Accept', 'application/json')
      .type('application/json');
    expect(resProfile.body.id).toBe(1);
    const { profileIconId, profileIconImageUrl, summonerLevel, tierInfo } =
      resProfile.body.lol;
    expect(profileIconId).toBeTruthy();
    expect(profileIconImageUrl).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
    expect(summonerLevel).toBeTruthy();
    const { tier, rank, leaguePoints } = tierInfo;
    expect(tier).toBeTruthy();
    expect(rank).toBeTruthy();
    expect(leaguePoints >= 0).toBeTruthy();
  });
});
