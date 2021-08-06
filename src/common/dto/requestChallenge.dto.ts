import { ApiProperty } from '@nestjs/swagger';

export class RequestChallengeDto {
  @ApiProperty()
  public lolNickname: string;

  @ApiProperty()
  public date: Date;

  @ApiProperty()
  public message: string;
}
