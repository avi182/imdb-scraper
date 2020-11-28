import { HttpService, Injectable } from '@nestjs/common';
import * as normalizeUrl from 'normalize-url';
import * as puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { Movie } from './types';

const IMDB_MOVIES_SHEET_ID = '1--FMdHdg_fnfBvebZwngB1pukZCrlPO5frcVazuP58Q';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getMoviesUrls() {
    return this.httpService
      .get(
        `https://docs.google.com/spreadsheets/d/${IMDB_MOVIES_SHEET_ID}/export?format=csv`,
      )
      .toPromise()
      .then((res) =>
        res.data.split('\r\n').map((url: string) => normalizeUrl(url)),
      );
  }

  async executeTasks(
    task: (page: puppeteer.Page, url: string) => void,
    args: string[],
  ) {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 15,
    });

    await cluster.task(async ({ page, data: url }) => task(page, url));

    await cluster.idle();

    const results = await Promise.all(args.map((a) => cluster.execute(a)));

    await cluster.close();

    return results;
  }

  async getMovies(urls: string[]) {
    return this.executeTasks(this.getMovie, urls);
  }

  async getMovie(page: puppeteer.Page, url: string): Promise<Movie | null> {
    return null;
  }
}
