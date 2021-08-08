import { ApiProperty } from '@nestjs/swagger';

export class UpdateDataDto {
  @ApiProperty()
  public lolNickname?: string;

  @ApiProperty()
  public school?: string;
}
