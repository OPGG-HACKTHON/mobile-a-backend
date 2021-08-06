import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public lolNickname: string;

  @ApiProperty()
  public school: string;
}
