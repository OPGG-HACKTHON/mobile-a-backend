import { Injectable } from '@nestjs/common';

@Injectable()
export class MainService {
  getUserInfo(): string {
    return 'will show user info';
  }

  getMyRank(): string {
    return 'will show my rank';
  }

  getSchoolRank(): string {
    return 'will show school rank';
  }
}
