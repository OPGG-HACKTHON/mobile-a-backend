import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
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
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  login(): string {
    return 'login';
  }

  // /auth/logout
  @Post('/logout')
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  logout(): string {
    return 'logout';
  }

  // /auth/login
  @Post('/signup')
  @ApiOkResponse({ description: '회원가입 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: SignupDto })
  signup(): string {
    return 'signup';
  }
}
