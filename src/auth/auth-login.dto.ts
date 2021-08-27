import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  message: string;

  @ApiProperty()
  authFrom?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  accessToken: string;
}
