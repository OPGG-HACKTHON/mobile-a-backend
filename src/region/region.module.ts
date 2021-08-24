import { Module } from '@nestjs/common';
import { RegoionService } from './region.service';
import { RefionController } from './region.controller';
@Module({
  controllers: [RefionController],
  providers: [RegoionService],
})
export class RegionModule {}
