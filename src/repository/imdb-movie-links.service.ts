import { HttpService, Injectable } from '@nestjs/common';
import * as normalizeUrl from 'normalize-url';

const IMDB_MOVIES_SHEET_ID = '1--FMdHdg_fnfBvebZwngB1pukZCrlPO5frcVazuP58Q';

@Injectable()
export class ImdbMovieLinksService {
  constructor(private readonly httpService: HttpService) {}

  async getLinks(): Promise<string[]> {
    return this.httpService
      .get(
        `https://docs.google.com/spreadsheets/d/${IMDB_MOVIES_SHEET_ID}/export?format=csv`,
      )
      .toPromise()
      .then((res) =>
        res.data.split('\r\n').map((url: string) => normalizeUrl(url)),
      );
  }
}
