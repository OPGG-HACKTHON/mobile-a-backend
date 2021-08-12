import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RankService } from './rank.service';

@ApiTags('Rank')
@Controller('/ranks')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  // ranks
  @Get('')
  @ApiOkResponse({ description: '전체 랭킹 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  getRank(): string {
    return 'get all ranking';
  }

  // ranks/schools/:id
  @Get('/schools/:id')
  @ApiOkResponse({ description: '학교 내에서의 특정 카테고리 랭킹 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getSchoolRank(@Param('id') category: number) {
    return 'get category ranking of school';
  }

  // ranks/regions/:id
  @Get('/regions/:id')
  @ApiOkResponse({ description: '지역 내에서의 특정 카테고리 랭킹 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getRegionRank(@Param('id') category: number) {
    return 'get category ranking of region';
  }
}
