import { ApiProperty } from '@nestjs/swagger';
import { ProfileRank } from './rank-profileRank.dto';

export class ProfileRankWithCompareField extends ProfileRank {
  @ApiProperty()
  fieldName: string;

  @ApiProperty()
  value: string;
}
