import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginDto } from 'src/common/dto/login.dto';
import { SignupDto } from 'src/common/dto/signup.dto';
import { UpdateDataDto } from 'src/common/dto/updateData.dto';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // api/users
  @Get('')
  @ApiOkResponse({ description: '유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  userInfo() {
    return 'get user info';
  }

  // api/users/:id
  @Get('/:id')
  @ApiOkResponse({ description: '특정 유저 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  partialUserInfo(@Param('id') userId: number) {
    return 'get partial user info';
  }

  // api/users/:id
  @Patch('/:id')
  @ApiOkResponse({ description: '유저 정보 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: UpdateDataDto })
  nickname(@Param('id') userId: number, @Body() updateData) {
    return 'edit user info';
  }
}
