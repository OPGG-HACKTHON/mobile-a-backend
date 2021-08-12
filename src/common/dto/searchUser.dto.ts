import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchUserDto {
  @ApiProperty()
  @IsString()
  public lolNickname: string;
}
