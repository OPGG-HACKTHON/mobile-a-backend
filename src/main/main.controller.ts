import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MainService } from './main.service';

@ApiTags('Main')
@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get()
  @ApiOkResponse({ description: '메인 뷰 조회 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: String })
  main(): string {
    return this.mainService.getUserInfo();
  }
}
