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

    this._isEnded = false;
  }

  _onItemHandlerFinished = () => {
    if (this._isEnded) {
      return;
    }

    if (this._queue.isEnded()) {
      this._waitinFor -= 1;
      if (this._waitinFor === 0) {
        this._isEnded = true;
        this._contrillingDeferred.resolve();
      }
    } else {
      const nextItem = this._queue.next();
      this._queueItemHandler(nextItem)
        .then(
          this._onItemHandlerFinished,
          this._onRejection
        );
    }
  }

  _onRejection = e => {
    if (this._isEnded) {
      return;
    }

    this._isEnded = true;
    this._contrillingDeferred.reject(e);
  }

  /**
   * @param {function(T): Promise<void>} queueItemHandler
   * @return {Promise.<void>}
   */
  run(queueItemHandler) {
    if (this._isEnded) {
      return;
    }

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
        .then(
          this._onItemHandlerFinished,
          this._onRejection
        );
      availableHandlers--;
    }

    this._waitinFor = handlersPool - availableHandlers;

    return this._contrillingDeferred.promise;
  }
}

module.exports = {
  PromiseQueue,
};
