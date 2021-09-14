import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { LOLService } from '../lol/lol.service';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  controllers: [SchoolController],
  providers: [SchoolService, LOLService, PrismaService],
})
export class SchoolModule {}
