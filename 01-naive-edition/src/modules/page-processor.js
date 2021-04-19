
class PageProcessor {

  /**
   * @param {PageOpeningContext} pageOpeningContext
   * @return {boolean}
   */
  shouldProcessPage({ url, openedPageUrl, httpResponse }) {
    const requiredUrl = new URL(url);
    const openedUrl = new URL(openedPageUrl);

    if (!httpResponse.ok()) {
      console.warn(`[PageProcessor]: Page '${url}' wasn't opened. HTTP status is '${httpResponse.status()}'`)
      return false;
    }

    if (requiredUrl.host !== openedUrl.host) {
      console.warn(
        `[PageProcessor]: Page '${url}' was opened on different host. Opened url is '${openedPageUrl}'`
      );
      return false;
    }

    return true;
  }

  /**
   * @param {import('puppeteer').Page} page
   * @param {PageOpeningContext} pageOpeningContext
   * @return {Promise<void>}
   */
  async process(page, pageOpeningContext) {
    const pageTitle = await page.title();

    let metaDescription
    try {
      metaDescription = await page.$eval(
        'meta[name=description]',
        meta => meta.getAttribute('content'),
      );
    } catch (e) {
      metaDescription = null;
    }

    const content = await page.$$eval(
      'h1,h2,h3,h4,h5,h6,p',
      nodes => nodes.map(
        node => node.textContent
          .replace(/\s+/g, ' ')
          .trim()
      ).join('. ')
    )

    return {
      url: pageOpeningContext.openedPageUrl,
      pageTitle,
      metaDescription,
      content,
    };
  };
}

module.exports = {
  PageProcessor,
};
