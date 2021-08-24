import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegoionService } from './region.service';
import { Region } from './region.dto';

@ApiTags('Region')
@Controller('/regions')
export class RefionController {
  constructor(private readonly regionService: RegoionService) {}

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
}
