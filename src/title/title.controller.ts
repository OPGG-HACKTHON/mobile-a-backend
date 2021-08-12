import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateDataDto } from 'src/common/dto/updateData.dto';
import { TitleService } from './title.service';

@ApiTags('Title')
@Controller('/titles')
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

  // /titles/:id
  @Get('/:id')
  @ApiOperation({
    summary: '유저 타이틀 히스토리 조회',
    description: '유저 타이틀 히스토리 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 타이틀 히스토리 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getTitleHistory(@Param('id') userId: number) {
    return 'get user title history';
  }

  // /titles/:id
  @Patch('/:id')
  @ApiOperation({
    summary: '유저 타이틀 수정',
    description: '유저 타이틀 수정을 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 타이틀 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  editTitle(@Param('id') userId: number, @Body() updateData: UpdateDataDto) {
    return 'edit user title';
  }
}
