import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { RankModule } from './rank/rank.module';
import { UserModule } from './user/user.module';
import { BattleModule } from './battle/battle.module';

@Module({
  imports: [UserModule, MainModule, RankModule, BattleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
