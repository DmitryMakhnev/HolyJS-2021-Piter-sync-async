
class RequestsInterceptor {

  /**
   * @param {import('puppeteer').Request} request
   */
  intercept(request) {
    if (request.url() === 'https://www.jetbrains.com/shop/cart.json') {
      request.respond({
        content: 'application/json',
        body: '{}'
      });
    } else {
      request.continue();
    }
  }

}

module.exports = {
  RequestsInterceptor,
};
