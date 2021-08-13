import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/common/dto/login.dto';
import { SignupDto } from 'src/common/dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'https';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // /auth/google
  @Get('/google')
  @ApiOperation({
    summary: '구글 로그인 시도',
    description: '구글 로그인을 시도합니다.',
  })
  @ApiOkResponse({ description: '구글 로그인 시도 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  // /auth/google
  @Get('/google/redirect')
  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 로그인을 진행합니다.',
  })
  @ApiOkResponse({ description: '구글 로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  // /auth/apple
  @Get('/apple')
  @ApiOperation({
    summary: '애플 로그인',
    description: '애플 로그인을 진행합니다.',
  })
  @ApiOkResponse({ description: '애플 로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  appleAuth(): string {
    return 'login';
  }

  // /auth/apple
  @Get('/apple/redirect')
  @ApiOperation({
    summary: '애플 로그인',
    description: '애플 로그인을 진행합니다.',
  })
  @ApiOkResponse({ description: '애플 로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  appleAuthRedirect(): string {
    return 'login';
  }

  // /auth/logout
  @Post('/logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 진행합니다.',
  })
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  logout(): string {
    return 'logout';
  }

  // /auth/login
  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입을 진행합니다.',
  })
  @ApiOkResponse({ description: '회원가입 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: SignupDto })
  async signup(@Body() signupData: SignupDto) {
    return 'signup';
  }
}
