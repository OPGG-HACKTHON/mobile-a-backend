import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from './battle-message-type.model';

export class MessageDTO {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public fromUserId: number;

  @ApiProperty()
  public fromlolNickname: string;

  @ApiProperty()
  public toUserId: number;

  @ApiProperty()
  public tololNickname: string;

  @ApiProperty({ enum: MessageType, description: 'ONETOONE or DUO' })
  public type: string;

  @ApiProperty()
  public message: string;

  @ApiProperty()
  public receiverSeen: boolean;

  @ApiProperty()
  public receiverAccept: boolean;
}
