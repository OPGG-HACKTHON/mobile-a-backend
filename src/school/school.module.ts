import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';

@Module({
  providers: [SchoolService],
})
export class SchoolModule {}
