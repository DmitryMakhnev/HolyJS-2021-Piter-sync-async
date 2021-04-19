const { Queue } = require('./queue');
const { PromiseQueue } = require('./promise-queue');

describe(`PromiseQueue`, () => {
  it(`Error handling`, () => {
    const queue = new Queue([1, 2, 3]);
    const promisesQueue = new PromiseQueue(queue, 2);
    try {
      promisesQueue.run(async () => {
        throw Error(`I'm so sorry`);
      });
    } catch (e) {
      expect(e.message).toBe(`I'm so sorry`);
    }
  });
});

