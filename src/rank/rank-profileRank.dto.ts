import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../user/user-profile.dto';

export enum RankChangedStatus {
  NEW = 'NEW',
  UP = 'UP',
  SAME = 'SAME',
  DOWN = 'DOWN',
}

export class ProfileRank extends ProfileDTO {
  @ApiProperty()
  rankNo: number;

  @ApiProperty({ enum: RankChangedStatus, description: 'changed rank status' })
  rankChangedStatus: RankChangedStatus;
}
