import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
