import { Module } from '@nestjs/common';
import { SchoolService } from '../school/school.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SchoolService],
  exports: [UserService],
})
export class UserModule {}
