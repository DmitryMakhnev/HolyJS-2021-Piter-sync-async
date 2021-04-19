const config = require('../../crawler.config');

class ConfigProvider {
  /**
   * @return {string}
   */
  getSitemapUrl() {
    return config.sitemapUrl;
  }

  /**
   * @return {string[]}
   */
  getLanguages() {
    return config.languages;
  }

  /**
   * @return {number}
   */
  getPageLoadingWaitingTimeout() {
    return config.pageLoadingWaitingTimeout;
  }

  /**
   * @return {number}
   */
  getPagesCountForDemo() {
    return config.pagesCountForDemo;
  }

  /**
   * @return {number}
   */
  getPagesPoolSize() {
    return config.pagesPoolSize;
  }
}

module.exports = {
  ConfigProvider,
};
