import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RankModule } from './rank/rank.module';
import { UserModule } from './user/user.module';
import { BattleModule } from './battle/battle.module';
import { AuthModule } from './auth/auth.module';
import { TitleModule } from './title/title.module';
import { PrismaModule } from './prisma/prisma.module';
import { LOLModule } from './lol/lol.module';
import { SchoolModule } from './school/school.module';
import { RegionModule } from './region/region.module';
@Module({
  imports: [
    UserModule,
    RankModule,
    BattleModule,
    AuthModule,
    TitleModule,
    PrismaModule,
    LOLModule,
    SchoolModule,
    RegionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
