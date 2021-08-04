import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginDto } from 'src/dtos/login.dto';
import { SignupDto } from 'src/dtos/signup.dto';
import { UpdateDataDto } from 'src/dtos/updateData.dto';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // users
  @Get()
  @ApiOkResponse({ description: '유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  userInfo() {
    return 'get user info';
  }

  // users/:id
  @Get('/:id')
  @ApiOkResponse({ description: '특정 유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  partialUserInfo(@Param('id') userId: number) {
    return 'get partial user info';
  }

  // users/:id
  @Patch('/:id')
  @ApiOkResponse({ description: '유저 정보 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: UpdateDataDto })
  nickname(@Param('id') userId: number, @Body() updateData) {
    return 'edit user info';
  }

  // users/login
  @Post('/login')
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: LoginDto })
  login(): string {
    return this.userService.login();
  }

  // users/signup
  @Post('/signup')
  @ApiOkResponse({ description: '회원가입 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: SignupDto })
  signup(): string {
    return this.userService.signup();
  }
}
