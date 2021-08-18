import { Global, Module } from '@nestjs/common';
import { SchoolService } from './school.service';

@Global()
@Module({
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
