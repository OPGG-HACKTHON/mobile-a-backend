import { Controller, Get } from '@nestjs/common';
@Controller('')
export class AppController {
  @Get()
  home() {
    const nowDate = new Date();
    console.log('test main - now time : ', nowDate);
    return 'OPGG_A_API';
  }
}
