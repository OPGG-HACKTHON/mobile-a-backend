export interface Match {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: {
      assists: number;
      longestTimeSpentLiving: number;
      totalTimeSpentDead: number;
      visionScore: number;
      detectorWardsPlaced: number;
      kills: number;
      doubleKills: number;
      tripleKills: number;
      quadraKills: number;
      pentaKills: number;
      deaths: number;
      largestKillingSpree: number;
      firstBloodKill: boolean;
      firstTowerKill: boolean;
      magicDamageDealtToChampions: number;
      physicalDamageDealtToChampions: number;
      totalDamageDealtToChampions: number;
      totalDamageTaken: number;
      totalHeal: number;
      dragonKills: number;
      baronKills: number;
      turretKills: number;
      objectivesStolen: number;
      gameEndedInEarlySurrender: boolean;
    }[];
  };
}
