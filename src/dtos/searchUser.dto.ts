import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiProperty()
  public lol_nickname: string;
}
