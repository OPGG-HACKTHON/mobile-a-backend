import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public lol_nickname: string;

  @ApiProperty()
  public school: string;
}
