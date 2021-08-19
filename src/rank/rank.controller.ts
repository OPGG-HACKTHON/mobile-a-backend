import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RankService } from './rank.service';
import { ParseIntPipe } from '@nestjs/common';
import { Profile } from '../user/user.types';
@ApiTags('Rank')
@Controller('/ranks')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  // ranks
  @Get('')
  @ApiOperation({
    summary: '전체 랭킹 조회',
    description: '전채 랭킹 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '전체 랭킹 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  getRank(): string {
    return 'get all ranking';
  }

  // ranks/schools/:id
  @Get('/schools/:id')
  @ApiOperation({
    summary: '학교 내 카테고리별 랭킹 조회',
    description: '학교 내 카테고리별 랭킹 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '학교 내에서의 특정 카테고리 랭킹 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getRankByScoolId(
    @Param('id', ParseIntPipe) schoolId: number,
  ): Promise<Profile[]> {
    return await this.rankService.getRankByScoolId(schoolId);
  }

  // ranks/regions/:id
  @Get('/regions/:id')
  @ApiOperation({
    summary: '지역 내 카테고리별 랭킹 조회',
    description: '지역 내 카테고리별 랭킹 조회를 진행합니다.',
  })
  @ApiOkResponse({ description: '지역 내에서의 특정 카테고리 랭킹 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getRegionRank(@Param('id') category: number) {
    return 'get category ranking of region';
  }
}
