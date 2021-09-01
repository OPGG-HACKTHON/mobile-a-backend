import { ApiProperty } from '@nestjs/swagger';

export class LOLCompareFieldDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  lolMatchFieldName: string;

  @ApiProperty()
  koCategory: string;

  @ApiProperty()
  koName: string;

  @ApiProperty()
  enName: string;
}
