import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './passport/google.strategy';
import { GoogleAuthService } from './passport/google-auth.service';
import { UserService } from 'src/user/user.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GoogleAuthService, UserService],
})
export class AuthModule {}
