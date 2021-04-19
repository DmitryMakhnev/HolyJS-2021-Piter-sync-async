const { ConfigProvider } = require('./modules/config-provider');
const { SitemapProvider } = require('./modules/sitemap-provider');
const { CrawlingUrlsResolver } = require('./modules/crawling-urls-resolver');
const { PagesWalker } = require('./modules/pages-walker');
const { PageProcessor } = require('./modules/page-processor');
const { RequestsInterceptor } = require('./modules/requests-intercepter');
const { saveJSON } = require('./modules/save-json');

const main = async () => {
  // Let's connect modules. Next time I'll take NestJS for it!
  const configProvider = new ConfigProvider();
  const sitemapProvider = new SitemapProvider(configProvider);
  const crawlingUrlsResolver = new CrawlingUrlsResolver(configProvider);
  const pagesWalker = new PagesWalker(configProvider);
  const pageProcessor = new PageProcessor();
  const requestsInterceptor = new RequestsInterceptor();

  // All right. Now I can write logic
  const urlsBySitemap = await sitemapProvider.getUrls();
  const crawlingUrls = crawlingUrlsResolver.resolve(urlsBySitemap);
  const finalCrawlingUrls = configProvider.getPagesCountForDemo() != null
    ? crawlingUrls.slice(0, configProvider.getPagesCountForDemo())
    : crawlingUrls;

  const results = [];

  const pagesCount = finalCrawlingUrls.length;
  let processedPagesCount = 0;

  await pagesWalker.run(
    finalCrawlingUrls,
    async (page, pageOpeningContext) => {

      if (pageProcessor.shouldProcessPage(pageOpeningContext)) {
        console.info(
          `[Crawler.main]: Start processing page '${pageOpeningContext.url}'`
        );
        const pageData = await pageProcessor.process(page, pageOpeningContext);
        results.push(pageData);
      } else {
        console.warn(
          `[Crawler.main]: Page '${pageOpeningContext.url}' was skipped`
        );
      }

      processedPagesCount += 1;
      console.info(
        `[Crawler.main]: '${processedPagesCount}' of '${pagesCount}' pages were processed`
      );
    },
    requestsInterceptor
  );

  await saveJSON(results, './results/results.json');
}

process.on('unhandledRejection', e => {
  console.error(e);
  process.exit(1);
});

console.time('Crawling');
main()
  .then(() => {
    console.timeEnd('Crawling');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
