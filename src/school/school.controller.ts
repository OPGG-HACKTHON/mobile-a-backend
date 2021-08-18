import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SchoolService } from './school.service';

@ApiTags('School')
@Controller('/schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  // /schools/search/:searchWord
  @Get('/search/:searchWord')
  @ApiOperation({
    summary: '학교 검색',
    description: '학교 이름 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '학교 이름 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getSchoolListBySearchParam(@Param('searchWord') searchWord: string) {
    return await this.schoolService.getSchoolListBySearchParam(searchWord);
  }
}
