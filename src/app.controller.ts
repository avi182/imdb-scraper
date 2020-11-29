import { Controller, Get } from '@nestjs/common';
import { ImdbMovieLinksService } from './repository/imdb-movie-links.service';

import { ScraperService } from './scraper/scraper.service';

@Controller()
export class AppController {
  // constructor(
  //   private readonly scraperService: ScraperService,
  //   private readonly movieLinksService: ImdbMovieLinksService,
  // ) {}
  // @Get()
  // async getMoviesUrls() {
  //   const res = await this.movieLinksService.getLinks();
  //   console.time('scrapeMany');
  //   const res2 = await this.scraperService.scrapeMovies(res);
  //   console.timeEnd('scrapeMany');
  //   return res2;
  // }
}
