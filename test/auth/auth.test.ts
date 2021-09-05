import { initSchema } from '../commn/schemaUtil';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';

import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
//
import { LOLService } from '../../src/lol/lol.service';
import { LOLModule } from '../../src/lol/lol.module';
//
import { TitleService } from '../../src/title/title.service';
import { TitleModule } from '../../src/title/title.module';

//
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UserService } from '../../src/user/user.service';
import { GoogleAuthService } from '../../src/auth/passport/google-auth.service';
//
describe('simple etst', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const googleAuthService = new GoogleAuthService();
  const lolService = new LOLService(prismaService);
  const userService = new UserService(prismaService, lolService);
  const authService = new AuthService(
    prismaService,
    userService,
    googleAuthService,
  );
  beforeEach(async () => {
    await initSchema(prismaService);
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, TitleModule, PrismaModule, LOLModule],
      providers: [AuthService, TitleService, PrismaService, LOLService],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  beforeAll(async () => {
    await prismaService.$disconnect();
  });

  it('not invalidate authfrom', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .type('application/json')
      .send({
        authFrom: 'notInvalidAuthFrom',
        email: 'abc@abc.com',
        LOLNickName: 'kkangsan',
        schoolId: '1',
        accesstoken: 'foo',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('유효하지 않은 가입 경로 입니다.');
    expect(res.body.status).toBe(400);
  });

  it('createUserToken and getUserByToken', async () => {
    await prismaService.region.create({
      data: {
        name: '서울',
      },
    });
    await prismaService.school.create({
      data: {
        id: '1',
        name: '가나다초등학교',
        division: '초딩',
        educationOffice: '서울시교육청',
        regionId: 1,
        address: '어디선가',
        imageUrl: '',
      },
    });

    await userService.createUser({
      authFrom: 'google',
      email: 'abc@abc.com',
      LOLNickName: 'kkangsan',
      schoolId: '1',
    });
    const token = await authService.createToken(1, 'google', 'foo-token');

    expect(token.token).toBe('google_foo-token');
    expect(token.userId).toBe(1);

    //
    const findedUser = await authService.getUserByToken('google_foo-token');
    expect(findedUser.email).toBe('abc@abc.com');
    expect(findedUser.schoolId).toBe('1');
  });
});
