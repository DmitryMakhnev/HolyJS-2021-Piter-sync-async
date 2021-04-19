const fs = require('fs');
const path = require('path');

/**
 * @param {*} data
 * @param {string} pathForSaving
 * @param {boolean} prettify
 * @return {Promise<void>}
 */
async function saveJSON(data, pathForSaving, prettify = true) {
  const jsonAsString = JSON.stringify(data, null, prettify ? 2 : undefined);
  const resultPath = path.join(process.cwd(), pathForSaving);
  return fs.promises.writeFile(
    resultPath,
    jsonAsString,
    { encoding: 'utf-8' }
  );
}

module.exports = {
  saveJSON,
};
