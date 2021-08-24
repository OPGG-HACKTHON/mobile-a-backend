import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public id: number;
}
