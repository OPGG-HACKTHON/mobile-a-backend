import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from './user-profile.dto';

export class ProfileSchool {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  division: string;

  @ApiProperty()
  regionId: number;

  @ApiProperty()
  address: string;
}

export class ProfileWithSchoolDTO extends ProfileDTO {
  @ApiProperty({ type: () => ProfileSchool })
  school: ProfileSchool;
}
