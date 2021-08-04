import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginDto } from './dtos/login.dto';

@ApiTags('API')
@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('setting/edit_nickname')
  @ApiOkResponse({ description: '롤 닉네임 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  editNickname(): string {
    return this.appService.getHello();
  }

  @Post('setting/edit_school')
  @ApiOkResponse({ description: '학교 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  editSchool(): string {
    return this.appService.getHello();
  }
}
