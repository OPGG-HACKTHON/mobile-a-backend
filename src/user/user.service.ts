import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  login(): string {
    return 'will login';
  }

  signup(): string {
    return 'will login';
  }
}
