import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../user/user-profile.dto';

export enum BattleResult {
  WIN = 'WIN',
  DRAW = 'DRAW',
  LOSE = 'LOSE',
}

export class ProfileBattleDTO extends ProfileDTO {
  @ApiProperty({
    enum: BattleResult,
    description: 'win or draw or lose',
    required: false,
  })
  result: BattleResult;
}
