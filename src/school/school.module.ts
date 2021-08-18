import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';

@Module({
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
