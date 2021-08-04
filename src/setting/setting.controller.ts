import { Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SettingService } from './setting.service';
import { EditNicknameDto } from 'src/dtos/editNickname.dto';
import { EditSchoolDto } from 'src/dtos/editSchool.dto';

@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post('edit_nickname')
  @ApiOkResponse({ description: '롤 닉네임 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: EditNicknameDto })
  editNickname(): string {
    return this.settingService.editNickname();
  }

  @Post('edit_school')
  @ApiOkResponse({ description: '학교 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: EditSchoolDto })
  editSchool(): string {
    return this.settingService.editSchool();
  }
}
