import { ApiProperty } from '@nestjs/swagger';

export class UpdateDataDto {
  @ApiProperty()
  public lol_nickname?: string;

  @ApiProperty()
  public school?: string;
}
