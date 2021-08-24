import { ApiProperty } from '@nestjs/swagger';

export class SignUpParam {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public LOLNickName: string;

  @ApiProperty()
  public schoolId: string;
}
