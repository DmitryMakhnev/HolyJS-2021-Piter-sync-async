/**
 * @template T
 * @param {T[]} array
 * @param {number} sliceSize
 * @return {T[][]}
 */
function splitArrayToChunks(array, sliceSize) {
  const result = [];
  for (let i = 0; i < array.length; i += sliceSize) {
    const chunk = array.slice(i, i + sliceSize);
    result.push(chunk);
  }
  return result;
}

module.exports = {
  splitArrayToChunks,
};
