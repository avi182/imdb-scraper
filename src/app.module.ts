import { Module } from '@nestjs/common';
import { MoviesModule } from './services/movies/movies.module';

@Module({
  imports: [MoviesModule],
})
export class AppModule {}
