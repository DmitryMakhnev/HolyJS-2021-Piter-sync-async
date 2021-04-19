/**
 * @template T
 */
class ResourcesPool {
  /**
   * @param {T[]} objectsList
   */
  constructor(objectsList) {
    this._objectTakingInfo = new Map();
    objectsList.forEach(object => {
      this._objectTakingInfo.set(object, false);
    });
  }

  /**
   * @return {T}
   */
  take() {
    for (let [object, isTaken] of this._objectTakingInfo) {
      if (!isTaken) {
        this._objectTakingInfo.set(object, true);
        return object;
      }
    }
  }

  /**
   * @param {T} object
   */
  free(object) {
    this._objectTakingInfo.set(object, false);
  }
}

module.exports = {
  ResourcesPool,
};
