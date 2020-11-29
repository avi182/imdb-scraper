import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../repository/respository.module';
import { ScraperModule } from '../../scraper/scraper.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [RepositoryModule, ScraperModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
