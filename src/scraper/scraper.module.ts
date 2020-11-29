import { Module } from '@nestjs/common';
import { MovieScraperService } from './movie/movie.scraper.service';
import { ScraperService } from './scraper.service';

@Module({
  providers: [ScraperService, MovieScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
