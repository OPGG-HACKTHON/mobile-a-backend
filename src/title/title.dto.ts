import { ApiProperty } from '@nestjs/swagger';

export class TitleDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  exposureName: string;
}
