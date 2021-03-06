import { ApiProperty } from '@nestjs/swagger';
export class TierInfo {
  @ApiProperty()
  tier: string;

  @ApiProperty()
  rank: string;

  @ApiProperty()
  leaguePoints: number;
}

export class ProfileInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  profileIconId: number;

  @ApiProperty()
  profileIconImageUrl: string;

  @ApiProperty()
  summonerLevel: number;

  @ApiProperty({ type: () => TierInfo })
  tierInfo: TierInfo;
}

export class ProfileTitle {
  @ApiProperty()
  id: number;

  @ApiProperty()
  exposureName: string;
}

export class ProfileDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => ProfileInfo })
  lol: ProfileInfo;

  @ApiProperty({ type: () => ProfileTitle })
  title: ProfileTitle;
}
