import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
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

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // /auth/login
  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인을 진행합니다.',
  })
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  login(): string {
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
