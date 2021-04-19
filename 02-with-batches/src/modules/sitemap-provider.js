const fetch = require('node-fetch');
const xml2js = require('xml2js');

const extractUrls = sitemapXML => {
  const urls = [];
  sitemapXML.urlset.url.forEach(urlRoot => {
    const links = urlRoot['xhtml:link'];
    if (links) {
      const uniqueLinksSet = links.reduce((result, url) => {
        result.add(url.$.href);
        return result;
      }, new Set());
      urls.push(...uniqueLinksSet);

    } else {
      urls.push(urlRoot.loc[0]);
    }
  })
  return urls;
};

class SitemapProvider {
  /**
   * @param {ConfigProvider} configProvider
   */
  constructor(configProvider) {
    this._configProvider = configProvider;
  }

  async getUrls() {
    const sitemapUrl = this._configProvider.getSitemapUrl();
    const sitemapResponse = await fetch(sitemapUrl);
    const sitemapAsText = await sitemapResponse.text();
    const sitemapXML = await new xml2js.Parser().parseStringPromise(sitemapAsText);
    return extractUrls(sitemapXML);
  }
}

module.exports = {
  SitemapProvider,
};
