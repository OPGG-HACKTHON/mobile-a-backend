import { ApiProperty } from '@nestjs/swagger';

export class LOLChampionDTO {
  @ApiProperty()
  id: number; // champion model key

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  name: string; // champion model name

  @ApiProperty()
  enName: string; // champion model enName
}
