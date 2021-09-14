import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Body,
  HttpCode,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TitleLogDTO, TitleStatus } from './title-log.dto';
import { TitleDTO } from './title.dto';
import { TitleParam } from './title.param';
import { TitleService } from './title.service';

@ApiTags('Title')
@Controller('/titles')
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

  //titles/users/:id
  @Get('/users/:id')
  @ApiOperation({
    summary: 'mock 유저의 타이틀 리스트 조회',
    description: '유저 타이틀 리스트를 조회 합니다.',
  })
  @ApiOkResponse({
    description: '유저 타이틀 리스트 조회 성공',
    type: TitleDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getTitlesByUserId(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<TitleDTO[]> {
    return [
      { id: 1, exposureName: '서울고 가렌 장인' },
      { id: 4, exposureName: '과학 천재' },
      { id: 5, exposureName: '죽지 않는' },
      { id: 6, exposureName: '매일 죽어있는' },
    ];
  }

  //titles/users/:id/logs
  @Get('/users/:id/logs')
  @ApiOperation({
    summary: 'mock 유저의 타이틀 히스토리 조회',
    description: '유저 타이틀 히스토리를 조회 합니다.',
  })
  @ApiOkResponse({
    description: '유저 타이틀 히스토리 조회 성공',
    type: TitleLogDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getTitleLogsByUserId(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<TitleLogDTO[]> {
    return [
      {
        id: 444,
        exposureName: '서울고 가렌 장인',
        titleStatus: TitleStatus.GET,
        createdAt: new Date('2021-09-07'),
      },
      {
        id: 333,
        exposureName: '과학 천재',
        titleStatus: TitleStatus.GET,
        createdAt: new Date('2021-09-05'),
      },
      {
        id: 222,
        exposureName: '과학 천재',
        titleStatus: TitleStatus.LOSE,
        createdAt: new Date('2021-09-04'),
      },
      {
        id: 111,
        exposureName: '과학 천재',
        titleStatus: TitleStatus.GET,
        createdAt: new Date('2021-09-04'),
      },
      {
        id: 10,
        exposureName: '죽지 않는',
        titleStatus: TitleStatus.GET,
        createdAt: new Date('2021-09-03'),
      },
      {
        id: 3,
        exposureName: '매일 죽어있는',
        titleStatus: TitleStatus.GET,
        createdAt: new Date('2021-09-02'),
      },
    ];
  }

  // put /titles/users/:id
  @Put('/users/:id')
  @ApiOperation({
    summary: 'mock 유저 타이틀 수정',
    description: '유저 타이틀 수정을 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 타이틀 수정 성공', type: Boolean })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: TitleParam })
  @HttpCode(204)
  async setTitleByUserIdAndTitleInSchoolId(
    @Body() param: TitleParam,
  ): Promise<boolean> {
    return true;
  }
}
