import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RankModule } from './rank/rank.module';
import { UserModule } from './user/user.module';
import { BattleModule } from './battle/battle.module';
import { AuthModule } from './auth/auth.module';
import { TitleModule } from './title/title.module';

@Module({
  imports: [UserModule, RankModule, BattleModule, AuthModule, TitleModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
