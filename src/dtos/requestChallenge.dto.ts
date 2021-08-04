import { ApiProperty } from '@nestjs/swagger';

export class RequestChallengeDto {
  @ApiProperty()
  public lol_nickname: string;

  @ApiProperty()
  public date: Date;

  @ApiProperty()
  public message: string;
}
