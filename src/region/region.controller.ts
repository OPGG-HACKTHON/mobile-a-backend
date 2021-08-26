import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegionService } from './region.service';
import { Region } from './region.dto';

@ApiTags('Region')
@Controller('/regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  // /regions
  @Get('')
  @ApiOperation({
    summary: '지역 목록 검색',
    description: '지역 목록 검색을 진행합니다.',
  })
  @ApiOkResponse({
    description: '지역 목록 검색',
    type: Region,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getRegions() {
    return await this.regionService.getRegions();
  }

  // /regions
  @Get('/:id')
  @ApiOperation({
    summary: '지역정보를 id로 검색합니다.',
    description: '지역정보를 id로 검색합니다.',
  })
  @ApiOkResponse({
    description: '지역 검색',
    type: Region,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getRegionById(@Param('id', ParseIntPipe) id: number) {
    return await this.regionService.getRegionById(id);
  }
}
