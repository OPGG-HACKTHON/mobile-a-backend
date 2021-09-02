import { ApiProperty } from '@nestjs/swagger';

export class LOLCompareFieldDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  lolMatchFieldName: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  enName: string;
}
