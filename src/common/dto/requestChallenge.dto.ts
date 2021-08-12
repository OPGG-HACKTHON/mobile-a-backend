import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class RequestChallengeDto {
  @ApiProperty()
  @IsString()
  public lolNickname: string;

  @ApiProperty()
  @IsDate()
  public date: Date;

  @ApiProperty()
  @IsString()
  public message: string;
}
