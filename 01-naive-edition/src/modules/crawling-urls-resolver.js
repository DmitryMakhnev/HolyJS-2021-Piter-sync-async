
class CrawlingUrlsResolver {
  /**
   * @param {ConfigProvider} configProvider
   */
  constructor(configProvider) {
    this._configProvider = configProvider;
  }

  /**
   * @param {string[]} urls
   * @return {string[]}
   */
  resolve(urls) {
    const languages = this._configProvider.getLanguages();
    const localizedPathnameStartRegExp = `^/(${languages.join(')|(')})/`;
    return urls.filter(url => {
      const pathname = new URL(url).pathname;
      return !new RegExp(localizedPathnameStartRegExp).test(pathname);
    });
  }
}

module.exports = {
  CrawlingUrlsResolver,
};
