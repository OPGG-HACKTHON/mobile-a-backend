import { ApiProperty } from '@nestjs/swagger';

export class EditNicknameDto {
  @ApiProperty()
  public lol_nickname: string;
}
