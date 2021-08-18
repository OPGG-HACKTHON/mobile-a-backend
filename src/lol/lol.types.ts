export interface SUMMONER {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

export type LEAGUE = Tier & { queueType: 'RANKED_FLEX_SR' & 'RANKED_SOLO_5x5' };

export interface Tier {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}
