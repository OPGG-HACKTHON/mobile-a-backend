import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiProperty()
  public lolNickname: string;
}
