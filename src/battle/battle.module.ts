import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';

@Module({
  imports: [UserModule],
  controllers: [BattleController],
  providers: [BattleService],
})
export class BattleModule {}
