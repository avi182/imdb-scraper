import { Controller, Get } from '@nestjs/common';
import { Movie } from '../../types';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @Get('all')
  async getMoviesUrls(): Promise<{
    success: boolean;
    data: { movies: Movie[] };
  }> {
    const movies = await this.moviesService.getAllMovies();
    return {
      success: true,
      data: { movies },
    };
  }
}
