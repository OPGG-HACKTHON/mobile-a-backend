import { ApiProperty } from '@nestjs/swagger';

export class LoginParam {
  @ApiProperty()
  public authFrom: string;

  @ApiProperty()
  public accesstoken: string;
}
