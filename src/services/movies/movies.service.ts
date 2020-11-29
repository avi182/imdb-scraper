import { Injectable } from '@nestjs/common';
import { ImdbMovieLinksService } from '../../repository/imdb-movie-links.service';
import { ScraperService } from '../../scraper/scraper.service';
import { Movie } from '../../types';

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieLinksService: ImdbMovieLinksService,
    private readonly scrapeService: ScraperService,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    const urls = await this.movieLinksService.getLinks();
    return await this.scrapeService.scrapeMovies(urls);
  }
}
