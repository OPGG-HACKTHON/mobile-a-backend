import { ApiProperty } from '@nestjs/swagger';

export class SignUpDTO {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public LOLNickName: string;

  @ApiProperty()
  public schoolId: number;
}