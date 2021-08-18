import { Global, Module } from '@nestjs/common';
import { LOLService } from './lol.service';

@Global()
@Module({
  providers: [LOLService],
  exports: [LOLService],
})
export class LOLModule {}
