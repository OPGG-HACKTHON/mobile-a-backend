import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../user/user.types';

export class ProfileRank extends Profile {
  @ApiProperty()
  seqNo: number;
}
