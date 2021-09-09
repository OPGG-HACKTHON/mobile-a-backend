import { ApiProperty } from '@nestjs/swagger';

export class TitleParam {
  @ApiProperty()
  public id: number;
}
