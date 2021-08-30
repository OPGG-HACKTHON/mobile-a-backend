import { Global, Module } from '@nestjs/common';
import { LOLController } from './lol.controller';
import { LOLService } from './lol.service';

@Global()
@Module({
  controllers: [LOLController],
  providers: [LOLService],
  exports: [LOLService],
})
export class LOLModule {}
