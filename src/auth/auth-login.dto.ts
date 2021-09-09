import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  authFrom?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  accessToken: string;
}
