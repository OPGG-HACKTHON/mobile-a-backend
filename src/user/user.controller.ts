import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // /users
  @Get('')
  @ApiOkResponse({ description: '유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getUserInfo() {
    return 'get user info';
  }

  // /users/:id
  @Get('/:id')
  @ApiOkResponse({ description: '특정 유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getPartialUserInfo(@Param('id') userId: number) {
    return 'get partial user info';
  }

  // /users/:id/lolNickname
  @Patch('/:id/lolNickname')
  @ApiOkResponse({ description: '유저 롤 닉네임 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  editLolNickname(@Param('id') userId: number, @Body() updateData) {
    return 'edit user lolNickname';
  }

  // /users/:id/school
  @Patch('/:id/school')
  @ApiOkResponse({ description: '유저 소속 학교 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  editSchool(@Param('id') userId: number, @Body() updateData) {
    return 'edit user school';
  }

  // /users/:id/title
  @Get('/:id/title')
  @ApiOkResponse({ description: '유저 타이틀 히스토리 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getTitleHistory(@Param('id') userId: number) {
    return 'get user title history';
  }

  // /users/:id/title
  @Patch('/:id/title')
  @ApiOkResponse({ description: '유저 타이틀 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  editTitle(@Param('id') userId: number, @Body() updateData) {
    return 'edit user title';
  }
}
