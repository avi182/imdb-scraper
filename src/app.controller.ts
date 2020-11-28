import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getMoviesUrls() {
    const res = await this.appService.getMoviesUrls();
    console.time('scrapeMany');
    const res2 = await this.appService.getMovies(res);
    console.timeEnd('scrapeMany');
    return res2;
  }
}
