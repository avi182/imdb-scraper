import { HttpModule, Module } from '@nestjs/common';
import { ImdbMovieLinksService } from './imdb-movie-links.service';

@Module({
  imports: [HttpModule],
  providers: [ImdbMovieLinksService],
  exports: [ImdbMovieLinksService],
})
export class RepositoryModule {}
