import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingService {
  editNickname(): string {
    return 'will edit nick name';
  }

  editSchool(): string {
    return 'will edit school';
  }
}
