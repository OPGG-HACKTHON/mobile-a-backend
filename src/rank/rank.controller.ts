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
@Controller('rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Get()
  @ApiOkResponse({ description: '랭킹 가져오기 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  getRank(): string {
    return this.rankService.getRank();
  }
}
