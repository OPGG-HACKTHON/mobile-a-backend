import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Profile } from './user.types';
import { ParseIntPipe } from '@nestjs/common';
import { UserDTO } from '../common/dto/user.dto';
@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // // /users
  // @Get('')
  // @ApiOperation({
  //   summary: '유저 데이터 조회',
  //   description: '유저 데이터 조회를 진행합니다.',
  // })
  // @ApiOkResponse({ description: '유저 데이터 조회 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // getUserInfo() {
  //   return 'test';
  // }

  // /users/:id
  @Get('/:id')
  @ApiOperation({
    summary: '유저 데이터 조회',
    description: '유저 데이터 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 데이터 조회 성공', type: UserDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    return await this.userService.getUserById(id);
  }

  // /users/:id/profile
  @Get('/:id/profile')
  @ApiOperation({
    summary: '유저 프로필 데이터 조회',
    description: '유저의 프로필 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 프로필 조회 성공', type: Profile })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getUserProfile(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Profile> {
    return await this.userService.getProfileByUserId(userId);
  }

  // // /users/:id/school
  // @Patch('/:id/school')
  // @ApiOperation({
  //   summary: '유저 학교 수정',
  //   description: '유저 학교 수정을 진행합니다.',
  // })
  // @ApiOkResponse({ description: '유저 소속 학교 수정 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // editSchool(@Param('id') userId: number, @Body() updateData) {
  //   return 'edit user school';
  // }
}
