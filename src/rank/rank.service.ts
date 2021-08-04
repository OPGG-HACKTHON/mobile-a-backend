import { Injectable } from '@nestjs/common';

@Injectable()
export class RankService {
  getRank(): string {
    return 'will get rank';
  }
}
