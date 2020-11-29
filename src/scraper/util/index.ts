import { Cluster } from 'puppeteer-cluster';
import * as puppeteer from 'puppeteer';

// This function accepts a scrape function callback and an array of urls to scrape
export const executeTasks = async (
  task: (page: puppeteer.Page, url: string) => any,
  args: string[],
): Promise<any[]> => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 15,
  });
  await cluster.task(async ({ page, data: url }) => task(page, url));
  await cluster.idle();
  const results = await Promise.all(args.map((a) => cluster.execute(a)));
  await cluster.close();
  return results;
};
