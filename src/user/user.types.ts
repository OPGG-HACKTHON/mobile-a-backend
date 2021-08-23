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
  profileIconId: number;

  @ApiProperty()
  profileIconImageUrl: string;

  @ApiProperty()
  summonerLevel: number;

  @ApiProperty({ type: () => TierInfo })
  tierInfo: TierInfo;
}

export class Profile {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => ProfileInfo })
  lol: ProfileInfo;
}
