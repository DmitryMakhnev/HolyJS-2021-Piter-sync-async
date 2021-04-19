const puppeteer = require('puppeteer');

const { splitArrayToChunks } = require('./split-array-to-chunks');

/**
 * @callback PageWalkerPageHandler
 * @param {import('puppeteer').Page} page
 * @param {PageOpeningContext} pageOpeningContext
 * @return {Promise}
 */

/**
 * @typedef {Object} PageOpeningContext
 * @property {string} url
 * @property {string} openedPageUrl
 * @property {import('puppeteer').HTTPResponse} httpResponse
 */

class PagesWalker {
  /**
   * @param {ConfigProvider} configProvider
   */
  constructor(configProvider) {
    this._configProvider = configProvider;
  }

  /**
   * @param {import('puppeteer').Browser} browser
   * @param {RequestsInterceptor} [requestsInterceptor]
   * @return {Promise<import('puppeteer').Page[]>}
   * @private
   */
  async _initPagesPool(browser, requestsInterceptor) {
    const pagesPoolSize = this._configProvider.getPagesPoolSize();
    const pagesInits = new Array(pagesPoolSize)
      .fill()
      .map(async () => {
        const page = await browser.newPage();

        if (requestsInterceptor) {
          await page.setRequestInterception(true);
          page.on('request', request => {
            requestsInterceptor.intercept(request);
          });
        }

        return page;
      });
    return Promise.all(pagesInits);
  }

  /**
   * @param {string} url
   * @param {import('puppeteer').Page} page
   * @param {PageWalkerPageHandler} handlePage
   * @return {Promise}
   * @private
   */
  async _loadPage(
    url,
    page,
    handlePage
  ) {
    console.info(
      `[PageWalker]: Start load '${url}'`
    );
    const pageLoadingWaitingTimeout = this._configProvider.getPageLoadingWaitingTimeout();

    const httpResponse = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: pageLoadingWaitingTimeout,
    });

    const openedPageUrl = page.url();

    await handlePage(page, {
      url,
      openedPageUrl,
      httpResponse,
    });
  }

  /**
   * @param {string[]} urls
   * @return {string[][]}
   * @private
   */
  _splitUrlsToChunks(urls) {
    const pagesPoolSize = this._configProvider.getPagesPoolSize();
    return splitArrayToChunks(urls, pagesPoolSize);
  }

  /**
   * @param {string[]} urls
   * @param {PageWalkerPageHandler} handlePage
   * @param {RequestsInterceptor} [requestsInterceptor]
   * @return {Promise<void>}
   */
  async run(
    urls,
    handlePage,
    requestsInterceptor,
  ) {
    const urlsByChunks = this._splitUrlsToChunks(urls);

    const browser = await puppeteer.launch();
    console.info('[PagesWalker]: Browser was launched');

    const pages = await this._initPagesPool(browser, requestsInterceptor);

    for (const urlsChunk of urlsByChunks) {
      const pageLoaders = urlsChunk.map(
        (url, i) => this._loadPage(url, pages[i], handlePage)
      );
      await Promise.all(pageLoaders);
    }

    await browser.close();
  }
}

module.exports = {
  PagesWalker,
};
