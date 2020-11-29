import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './services/movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [AppController],
})
export class AppModule {}
