import { ApiProperty } from '@nestjs/swagger';
import { RankChangedStatus } from './rank-profileRank.dto';

export class SchoolProfileRank {
  @ApiProperty()
  rankNo: number;

  @ApiProperty({ enum: RankChangedStatus, description: 'changed rank status' })
  rankChangedStatus: RankChangedStatus;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  point: number;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  division: string;
}
