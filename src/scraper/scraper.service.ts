import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { Movie } from '../types';
import { MovieScraperService } from './movie/movie.scraper.service';
import { executeTasks } from './util';

@Injectable()
export class ScraperService {
  constructor(private readonly movieScraperService: MovieScraperService) {}
  // This function takes an array of imdb movie urls and scrape it
  async scrapeMovies(urls: string[]): Promise<Movie[]> {
    return executeTasks(this.movieScraperService.getMovie, urls);
  }
}
