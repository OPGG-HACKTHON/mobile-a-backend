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
    summary: '유저의 타이틀 리스트 조회',
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
    // todo test
    return await this.titleService.getTitlesByUserId(userId);
  }

  //titles/users/:id/logs
  @Get('/users/:id/logs')
  @ApiOperation({
    summary: '유저의 타이틀 히스토리 조회',
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
    // todo test
    return await this.titleService.getTitleLogsByUserId(userId);
  }

  // put /titles/users/:id
  @Put('/users/:id')
  @ApiOperation({
    summary: '유저 타이틀 수정',
    description: '유저 타이틀 수정을 진행합니다.',
  })
  @ApiOkResponse({ description: '유저 타이틀 수정 성공', type: Boolean })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: TitleParam })
  @HttpCode(204)
  async setTitleByUserIdAndTitleInSchoolId(
    @Param('id', ParseIntPipe) userId: number,
    @Body() param: TitleParam,
  ): Promise<boolean> {
    return await this.titleService.setUserTitleByTitleId(userId, param.id);
  }
}
