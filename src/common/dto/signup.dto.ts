import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsString()
  public email: string;

  @ApiProperty()
  @IsString()
  public lolNickname: string;

  @ApiProperty()
  @IsString()
  public school: string;
}
