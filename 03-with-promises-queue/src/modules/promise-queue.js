const { Deferred } = require('./deferred');

/**
 * @template T
 */
class PromiseQueue {
  /**
   * @param {Queue<T>} queue
   * @param {number} handlersPoolSize
   */
  constructor(
    queue,
    handlersPoolSize
  ) {
    this._queue = queue;
    this._handlersPoolSize = handlersPoolSize;
    this._queueItemHandler = null;

    this._watingFor = 0;
    /**
     * @type {Deferred|null}
     * @private
     */
    this._contrillingDeferred = null;
  }

  _onItemHandlerFinished = () => {
    if (this._queue.isEnded()) {
      this._waitinFor -= 1;
      if (this._waitinFor === 0) {
        this._contrillingDeferred.resolve();
      }
    } else {
      this._queueItemHandler(this._queue.next()).then(this._onItemHandlerFinished);
    }
  }

  /**
   * @param {function(T): Promise<void>} queueItemHandler
   * @return {Promise.<void>}
   */
  run(queueItemHandler) {
    const queue = this._queue;
    if (queue.isEnded()) {
      return Promise.resolve();
    }

    this._contrillingDeferred = new Deferred();
    this._queueItemHandler = queueItemHandler;

    const handlersPool = this._handlersPoolSize;
    let availableHandlers = handlersPool;

    // use full available pool
    while (availableHandlers !== 0 && !queue.isEnded()) {
      const currentQueueItem = queue.next();
      this._queueItemHandler(currentQueueItem)
        .then(this._onItemHandlerFinished);
      availableHandlers--;
    }

    this._waitinFor = handlersPool - availableHandlers;

    return this._contrillingDeferred.promise;
  }
}

module.exports = {
  PromiseQueue,
};
