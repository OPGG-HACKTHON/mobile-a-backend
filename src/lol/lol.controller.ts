import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LOLService } from './lol.service';
import { LOLChampionDTO } from './lol-champion.dto';

@ApiTags('LOL')
@Controller('/lol')
export class LOLController {
  constructor(private readonly lolService: LOLService) {}

  @Get('champions')
  @ApiOperation({
    summary: '전체 챔피언 조회',
    description: '전채 챔피언을 조회를 진행합니다.',
  })
  @ApiOkResponse({
    description: '전체 챔피언 조회 성공',
    type: LOLChampionDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getChampions(): LOLChampionDTO[] {
    return this.lolService.getChampions();
  }

  @Get('champions/:id')
  @ApiOperation({
    summary: '챔피언 id 조회',
    description: '챔피언을 id로 조회를 진행합니다.',
  })
  @ApiOkResponse({
    description: '챔피언 조회 성공',
    type: LOLChampionDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  getChampionById(@Param('id', ParseIntPipe) id: number): LOLChampionDTO {
    return this.lolService.getChampionById(id);
  }
}
