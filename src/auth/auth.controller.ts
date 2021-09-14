import {
  Body,
  Controller,
  Post,
  HttpCode,
  Query,
  Get,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpParam } from './auth-signup.param';
import { UserDTO } from '../common/dto/user.dto';
import { LoginParam } from './auth-login.param';
import { LoginDTO } from './auth-login.dto';
import { ProfileWithSchoolDTO } from '../user/user-profileWithSchool.dto';
import { SignUpRandomParam } from './auth-signup-random.param';
import jwt from 'jsonwebtoken';
import path from 'path';
import AppleAuth from 'apple-auth';
import fs from 'fs';
import * as appleConfig from '../../secrets/config.json';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // /auth/login
  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '각 플랫폼 토큰으로 로그인을 진행합니다.',
  })
  @ApiOkResponse({ description: '로그인 성공', type: LoginDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginParam })
  async login(@Body() param: LoginParam): Promise<LoginDTO> {
    return await this.authService.login(param);
  }
  // // /auth/logout
  // @Post('/logout')
  // @ApiOperation({
  //   summary: '로그아웃',
  //   description: '로그아웃을 진행합니다.',
  // })
  // @ApiOkResponse({ description: '로그인 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // @ApiBody({ type: LoginDTO })
  // logout(): string {
  //   return 'logout';
  // }

  // /auth/signup
  @Post('/signup')
  @HttpCode(201)
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입을 진행합니다.',
  })
  @ApiOkResponse({ description: '회원가입 성공', type: ProfileWithSchoolDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: SignUpParam })
  async signUp(@Body() param: SignUpParam): Promise<ProfileWithSchoolDTO> {
    return await this.authService.signUp(param);
  }

  /**
   * @Google
   */
  // /auth/google
  @Get('google')
  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 로그인을 진행합니다.',
  })
  @ApiOkResponse({ description: '구글 로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    //
  }

  // /auth/google/callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const userData = await this.authService.googleLogin(req);
    return userData;
  }

  // @Post('/validate')
  // @ApiOperation({
  //   summary: '토큰을 통해 유저 정보 조회',
  //   description:
  //     '로그인으로 응답받은 토큰을 이용해 유저 정보 조회를 진행합니다.',
  // })
  // @ApiQuery({ name: 'accessToken' })
  // @ApiOkResponse({ description: '유저 정보 조회 성공', type: UserDTO })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // async googleTokenTest(
  //   @Query('accessToken') accessToken: string,
  // ): Promise<UserDTO> {
  //   return await this.authService.getUserByToken(accessToken);
  // }

  /**
   * @Apple
   */
  // /auth/apple
  // @Post('apple')
  // @ApiOperation({
  //   summary: '애플 로그인',
  //   description: '애플 로그인을 진행합니다.',
  // })
  // @ApiOkResponse({ description: '애플 로그인 성공' })
  // @ApiQuery({ name: 'token' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // async appleLogin(@Query('token') token: string): Promise<any> {
  //   const auth = new AppleAuth(
  //     appleConfig,
  //     path.join(__dirname, `../../secrets/${appleConfig.private_key_path}`),
  //     'form_post',
  //   );
  //   console.log(auth);

  //   console.log('token:', token);
  //   if (!token) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_REQUEST,
  //         error: 'token 에러',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const data = await auth.accessToken(token);
  //   const idToken = jwt.decode(data.id_token);
  //   console.log(idToken);
  //   return idToken;
  // }

  // @Get('apple')
  // @ApiOperation({
  //   summary: '애플 로그인',
  //   description: '애플 로그인을 진행합니다.',
  // })
  // @ApiOkResponse({ description: '애플 로그인 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // async getAppleLogin(req, res) {}

  @Post('/validate')
  @ApiOperation({
    summary: '유저 정보 조회',
    description: '토큰을 이용해 유저 정보 조회를 진행합니다.',
  })
  @ApiQuery({ name: 'token' })
  @ApiOkResponse({
    description: '유저 정보 조회 성공',
    type: ProfileWithSchoolDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getUserByToken(
    @Query('token') token: string,
  ): Promise<ProfileWithSchoolDTO> {
    return await this.authService.getUserByToken(token);
  }

  @Post('/signup/random')
  @ApiOperation({
    summary: '램덤 유저 생성',
    description: '램덤 유저를 생성합니다.',
  })
  @ApiOkResponse({
    description: '램덤 유저 생성',
    type: ProfileWithSchoolDTO,
  })
  @ApiBody({ type: SignUpRandomParam })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async signUpRandomUser(
    @Body() param: SignUpRandomParam,
  ): Promise<ProfileWithSchoolDTO> {
    return await this.authService.signUpRandomUser(param);
  }
}
