import { Injectable } from '@nestjs/common';

@Injectable()
export class BattleService {
  searchUser(): string {
    return 'will search user';
  }

  compare(): string {
    return 'will compare between two user data';
  }

  requestChallenge(): string {
    return 'will request challenge';
  }
}
