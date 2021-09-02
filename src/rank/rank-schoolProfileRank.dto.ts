import { ApiProperty } from '@nestjs/swagger';
import { RankChangedStatus } from './rank-profileRank.dto';

export class SchoolProfileRank {
  @ApiProperty()
  rankNo: number;

  @ApiProperty({ enum: RankChangedStatus, description: 'changed rank status' })
  rankChangedStatus: RankChangedStatus;

  @ApiProperty()
  point: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  division: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
