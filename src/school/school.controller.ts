import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { School } from './school.entity';
import { Division } from './school.model';

@ApiTags('School')
@Controller('/schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  // /schools/search?searchWord&division
  @Get('/search')
  @ApiQuery({ name: 'searchWord' })
  @ApiQuery({ name: 'division', required: false, enum: Division })
  @ApiOperation({
    summary: '학교 검색',
    description: '학교 이름 조회를 진행합니다. (최대 50개)',
  })
  @ApiOkResponse({
    description: '학교 이름 조회 성공',
    type: School,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getSchoolListBySearchParam(
    @Query('searchWord') searchWord: string,
    @Query('division') division?: string,
  ) {
    return await this.schoolService.getSchoolListBySearchParamOptionalDivision({
      searchWord: searchWord,
      division: division,
    });
  }

  // /schools
  @Get('/:id')
  @ApiOperation({
    summary: '학교 id 검색',
    description: '학교 id 조회를 진행합니다.',
  })
  @ApiOkResponse({
    description: '학교 id 조회 성공',
    type: School,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getSchoolById(@Param('id') id: string) {
    return await this.schoolService.getSchoolById(id);
  }
}
