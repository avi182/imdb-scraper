import { HttpService, Injectable } from '@nestjs/common';
import * as normalizeUrl from 'normalize-url';
import * as puppeteer from 'puppeteer';
import * as moment from 'moment';
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
    page.setViewport({ width: 1440, height: 900 });
    await page.setJavaScriptEnabled(false);
    await page.goto(url);

    // Getting the name & year
    await page.waitForSelector('.vital');
    const { name, year } = await page.$eval('.title_wrapper > h1', (h1) => {
      const [nameNode, yearNode] = h1.childNodes;
      const name = nameNode.textContent.trim();
      const year = yearNode.textContent.slice(1, -1);
      return { name, year };
    });

    // Rating
    const rating = await page.$eval('[itemprop=ratingValue]', (element) =>
      Number(element.textContent),
    );

    // Getting the movies genres
    await page.waitForSelector('#titleStoryLine');
    const genres = await page.$eval('#titleStoryLine', (children) => {
      const divs = children.querySelectorAll('div');
      const genres = [];
      divs.forEach((div) => {
        const h4Element = div.querySelector('h4');
        const title = h4Element?.textContent;
        if (title?.includes('Genre')) {
          const linkElements = div.querySelectorAll('a');
          linkElements.forEach((link) => genres.push(link?.textContent.trim()));
          return;
        }
      });
      return genres;
    });

    // Getting extra info (budget, total gross revenue, release date, movie's runtime)
    await page.waitForSelector('#titleDetails');
    const { budget, cumulativeGross, releaseDate, runtime } = await page.$eval(
      '#titleDetails',
      (blocks) => {
        const data = {
          budget: null,
          cumulativeGross: null,
          releaseDate: null,
          runtime: null,
          usaGross: null,
        };
        blocks.querySelectorAll('div').forEach((div) => {
          div.childNodes.forEach((node, index) => {
            const currProperty = node.textContent.trim();
            if (currProperty.includes('Budget')) {
              const budgetStr = div.childNodes[index + 1].textContent.trim();
              data.budget = Number(budgetStr.replace(/[^0-9\.]+/g, ''));
            } else if (currProperty.includes('Cumulative Worldwide Gross')) {
              const cumulativeGrossStr = div.childNodes[
                index + 1
              ].textContent.trim();
              data.cumulativeGross = Number(
                cumulativeGrossStr.replace(/[^0-9\.]+/g, ''),
              );
            } else if (currProperty.includes('Release Date')) {
              data.releaseDate = div.childNodes[index + 1].textContent
                .trim()
                .split('(')[0]
                .trim();
            } else if (currProperty.includes('Runtime')) {
              data.runtime = Number(
                div.querySelector('time').textContent.split(' ')[0],
              );
            }
          });
        });
        return data;
      },
    );

    // Returning a Movie object
    return {
      name,
      year,
      rating,
      runtime,
      genres,
      releaseDate: moment(releaseDate, 'DD MMMM YYYY').valueOf(),
      budget: budget || 0,
      cumulativeGross: cumulativeGross || 0,
    };
  }
}
