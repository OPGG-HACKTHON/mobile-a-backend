import { Controller, Get } from '@nestjs/common';
@Controller('')
export class AppController {
  @Get()
  home() {
    return 'OPGG_A_API';
  }
}
