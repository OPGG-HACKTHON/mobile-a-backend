import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
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
  @ApiOperation({
    summary: '유저 데이터 조회',
    description: '유저 데이터 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getUserInfo() {
    this.userService.getSchoolData();
  }

  // /users/:id
  @Get('/:id')
  @ApiOperation({
    summary: '특정 데이터 조회',
    description: '특정 데이터 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '특정 유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getPartialUserInfo(@Param('id') userId: number) {
    return 'get partial user info';
  }

  // /users/:id/school
  @Patch('/:id/school')
  @ApiOperation({
    summary: '유저 학교 수정',
    description: '유저 학교 수정을 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 소속 학교 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  editSchool(@Param('id') userId: number, @Body() updateData) {
    return 'edit user school';
  }
}
