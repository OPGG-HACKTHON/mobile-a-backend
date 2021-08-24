import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty()
  access_token: string;
}
