import { Module } from '@nestjs/common';
import { TitleController } from './title.controller';
import { TitleService } from './title.service';

@Module({
  controllers: [TitleController],
  providers: [TitleService],
})
export class TitleModule {}
