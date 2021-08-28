import { ApiProperty } from '@nestjs/swagger';
import { AuthFrom } from './auth.model';

export class SignUpParam {
  @ApiProperty({ enum: AuthFrom, description: 'google or apple' })
  public authFrom: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public LOLNickName: string;

  @ApiProperty()
  public schoolId: string;

  @ApiProperty()
  public accesstoken: string;
}
