import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../user/user-profile.dto';

export class ProfileRank extends ProfileDTO {
  @ApiProperty()
  seqNo: number;
}
