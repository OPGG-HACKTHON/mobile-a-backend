import { Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BattleService } from './battle.service';
import { RequestChallengeDto } from 'src/common/dto/requestChallenge.dto';
@ApiTags('Battle')
@Controller('api/battles')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('compare')
  @ApiOkResponse({ description: '비교 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  compare(): string {
    return 'compare two users';
  }

  @Get('challenge')
  @ApiOkResponse({ description: '결투 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: RequestChallengeDto })
  checkChallenge(): string {
    return 'check challenge';
  }

  @Post('challenge')
  @ApiOkResponse({ description: '결투 신청 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: RequestChallengeDto })
  requestChallenge(): string {
    return 'request challenge';
  }
}
