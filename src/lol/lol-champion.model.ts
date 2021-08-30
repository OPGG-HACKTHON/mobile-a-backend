export interface CHAMPION {
  [key: string]: CHAMPION_DETAIL;
}

interface CHAMPION_DETAIL {
  id: string;
  key: string;
  name: string;
}
