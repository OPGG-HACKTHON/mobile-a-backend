import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RankService } from './rank.service';

@ApiTags('Rank')
@Controller('/api')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Post('/rank')
  @ApiOkResponse({ description: '유저 로그인' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  rank(): string {
    return this.rankService.getRank();
  }
}
