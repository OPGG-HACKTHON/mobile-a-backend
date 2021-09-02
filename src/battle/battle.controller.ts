import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  HttpCode,
  Body,
} from '@nestjs/common';
import { BattleService } from './battle.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileDTO } from '../user/user-profile.dto';
import { MessageParam } from './battle-message.param';
import { MessageDTO } from './battle-message.dto';
import { MessageType } from './battle-message-type.model';

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

  @Post('/messages/send')
  @HttpCode(201)
  @ApiOperation({
    summary: '배틀 상대에게 메세지 전송',
    description: '배틀 상대에게 메세지를 전송합니다.',
  })
  @ApiOkResponse({ description: '메세지 데이터 전송 성공', type: MessageDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: MessageParam })
  async sendMessage(@Body() param: MessageParam): Promise<MessageDTO> {
    // todo
    return {
      id: 1,
      fromUserId: param.fromUserId,
      fromlolNickname: 'abcd2',
      toUserId: param.toUserId,
      tololNickname: 'abcd2',
      type: param.type,
      message: param.message,
      receiverSeen: false,
      receiverAccept: false,
    };
  }

  @Get('/messages/result/users/:id')
  @ApiOperation({
    summary: '유저가 보냈던 메세지 결과 목록',
    description: '유저가 보냈던 메세지 결과 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '유저가 보냈던 메세지 결과 목록을 조회',
    type: MessageDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getResultMessages(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageDTO[]> {
    // todo
    return [
      {
        id: 1,
        fromUserId: 11,
        fromlolNickname: 'abcd2',
        toUserId: 123123,
        tololNickname: 'abcd2',
        type: MessageType.DUO,
        message: '테스트 메세지!',
        receiverSeen: true,
        receiverAccept: false,
      },
      {
        id: 1,
        fromUserId: 11,
        fromlolNickname: 'abcd2',
        toUserId: 123123,
        tololNickname: 'abcd222',
        type: MessageType.ONETOONE,
        message: '테스트 메세지!22',
        receiverSeen: false,
        receiverAccept: true,
      },
    ];
  }

  @Get('/messages/notSeen/users/:id')
  @ApiOperation({
    summary: '유저가 읽지 않은 메세지 목록',
    description: '유저가 읽지 않은 메세지 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '유저가 읽지 않은 메세지 목록',
    type: MessageDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async getCheckMessages(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageDTO[]> {
    // todo
    return [
      {
        id: 1,
        fromUserId: 11,
        fromlolNickname: 'abcd2',
        toUserId: 123123,
        tololNickname: 'abcd222',
        type: MessageType.DUO,
        message: '테스트 메세지!',
        receiverSeen: false,
        receiverAccept: false,
      },
      {
        id: 1,
        fromUserId: 11,
        fromlolNickname: 'abcd2',
        toUserId: 123123,
        tololNickname: 'abcd2',
        type: MessageType.ONETOONE,
        message: '테스트 메세지!22',
        receiverSeen: false,
        receiverAccept: true,
      },
    ];
  }

  @Get('search/:lolNickname')
  @ApiOperation({
    summary: '배틀 상대 조회',
    description: '배틀 상대의 프로필을 검색 합니다.',
  })
  @ApiOkResponse({
    description: '배틀 상대 조회 성공',
    type: ProfileDTO,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  async searchProfilesBylolNickname(
    @Param('lolNickname') searchParam: string,
  ): Promise<ProfileDTO[]> {
    return await this.battleService.searchProfilesBylolNickname(searchParam);
  }
}
