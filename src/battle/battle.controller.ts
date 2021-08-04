import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SearchUserDto } from 'src/dtos/searchUser.dto';
import { BattleService } from './battle.service';
import { RequestChallengeDto } from 'src/dtos/requestChallenge.dto';
@ApiTags('Battle')
@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post('searchUser')
  @ApiOkResponse({ description: '유저 검색 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: SearchUserDto })
  searchUser(): string {
    return this.battleService.searchUser();
  }

  @Get('compare')
  @ApiOkResponse({ description: '비교 데이터 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  compare(): string {
    return this.battleService.compare();
  }

  @Post('requestChallenge')
  @ApiOkResponse({ description: '결투 신청 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: RequestChallengeDto })
  requestChallenge(): string {
    return this.battleService.requestChallenge();
  }
}
