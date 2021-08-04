import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RankModule } from './rank/rank.module';
import { UserModule } from './user/user.module';
import { BattleModule } from './battle/battle.module';

@Module({
  imports: [UserModule, RankModule, BattleModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
