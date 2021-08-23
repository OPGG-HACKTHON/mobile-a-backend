import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  HttpCode,
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
import { LoginDTO } from './auth-login.param';
import { SignUpParam } from './auth-signup.param';
import { UserDTO } from 'src/common/dto/user.dto';
import { AuthDTO } from './auth-login.dto';
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
  @ApiOkResponse({ description: '로그인 성공', type: AuthDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDTO })
  async login(@Body() param: LoginDTO): Promise<{ access_token: string }> {
    return { access_token: param.id.toString() };
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
  @ApiOkResponse({ description: '회원가입 성공', type: UserDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: SignUpParam })
  async signUp(@Body() param: SignUpParam) {
    return await this.authService.signUp(param);
  }
}
