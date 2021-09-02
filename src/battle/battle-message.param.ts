import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from './battle-message-type.model';

export class MessageParam {
  @ApiProperty()
  public fromUserId: number;

  @ApiProperty()
  public toUserId: number;

  @ApiProperty({ enum: MessageType, description: 'ONETOONE or DUO' })
  public type: string;

  @ApiProperty()
  public message: string;
}
