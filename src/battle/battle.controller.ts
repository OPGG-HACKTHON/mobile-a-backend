import { Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BattleService } from './battle.service';
import { RequestChallengeDto } from 'src/common/dto/requestChallenge.dto';
@ApiTags('Battle')
@Controller('/battles')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  // @Get('compare')
  // @ApiOperation({
  //   summary: '비교 데이터 조회',
  //   description: '비교 데이터 조회를 진행합니다.',
  // })
  // @ApiOkResponse({ description: '비교 데이터 조회 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // @ApiBody({ type: String })
  // compare(): string {
  //   return 'compare two users';
  // }

  // @Get('challenge')
  // @ApiOperation({
  //   summary: '결투조회',
  //   description: '결투 조회를 진행합니다.',
  // })
  // @ApiOkResponse({ description: '결투 조회 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // @ApiBody({ type: RequestChallengeDto })
  // checkChallenge(): string {
  //   return 'check challenge';
  // }

  // @Post('challenge')
  // @ApiOperation({
  //   summary: '결투신청',
  //   description: '결투 신청을 진행합니다.',
  // })
  // @ApiOkResponse({ description: '결투 신청 성공' })
  // @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  // @ApiBody({ type: RequestChallengeDto })
  // requestChallenge(): string {
  //   return 'request challenge';
  // }
}
