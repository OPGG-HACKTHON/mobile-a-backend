export interface Profile {
  id: number;
  lol: {
    profileIconId: number;
    profileIconImageUrl: string;
    summonerLevel: number;
    tierInfo: {
      tier: string;
      rank: string;
      leaguePoints: number;
    };
  };
}
