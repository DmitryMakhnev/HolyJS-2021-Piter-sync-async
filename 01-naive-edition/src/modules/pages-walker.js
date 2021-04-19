const puppeteer = require('puppeteer');

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
   * @param {string[]} urls
   * @param {function(page: import('puppeteer').Page, PageOpeningContext): Promise} handler
   * @param {RequestsInterceptor} [requestsInterceptor]
   * @return {Promise<void>}
   */
  async run(urls, handler, requestsInterceptor) {
    const pageLoadingWaitingTimeout = this._configProvider.getPageLoadingWaitingTimeout();

    const browser = await puppeteer.launch();
    console.info('[PagesWalker]: Browser was launched');

    const page = await browser.newPage();

    if (requestsInterceptor) {
      await page.setRequestInterception(true);
      page.on('request', request => {
        requestsInterceptor.intercept(request);
      });
    }

    for (const url of urls){
      const httpResponse = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: pageLoadingWaitingTimeout,
      });

      const openedPageUrl = page.url();

      await handler(page, {
        url,
        openedPageUrl,
        httpResponse,
      });
    }

    await browser.close();
  }
}

module.exports = {
  PagesWalker,
};
