import { ApiProperty } from '@nestjs/swagger';
import { AuthFrom } from './auth.model';

export class LoginParam {
  @ApiProperty({ enum: AuthFrom, description: 'google or apple' })
  public authFrom: string;

  @ApiProperty()
  public accesstoken: string;
}
