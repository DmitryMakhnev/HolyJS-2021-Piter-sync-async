/**
 * @template T
 */
class Queue {
  /**
   * @param {T[]} list
   */
  constructor(list) {
    this._list = list;
  }

  /**
   * @return {T}
   */
  next() {
    return this._list.shift();
  }

  /**
   * @return {boolean}
   */
  isEnded() {
    return this._list.length === 0;
  }
}

module.exports = {
  Queue,
};


