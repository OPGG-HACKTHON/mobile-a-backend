import { ApiProperty } from '@nestjs/swagger';

export class LOLCompareFieldDetailDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  lolMatchFieldName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  enName: string;

  @ApiProperty()
  title: string;
}

export class LOLCompareFieldDTO {
  @ApiProperty()
  category: string;

  @ApiProperty({ type: () => LOLCompareFieldDetailDTO, isArray: true })
  fields: LOLCompareFieldDetailDTO[];
}
