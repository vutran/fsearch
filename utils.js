const path = require('path');
const fs = require('fs');

/**
 * Matches the input against the list of files
 *
 * - Base name matches
 * - File name matches
 *
 * @param {String} input - The input
 * @param {Array} files - An array of file paths
 */
function matchFiles(input, files) {
  return files.filter(f => {
    const baseName = path.basename(f);
    const fileName = path.basename(f, path.extname(f));
    const inputLower = input.toLowerCase();
    if (baseName.toLowerCase() === inputLower) {
      return true;
    } else if (fileName.toLowerCase() === inputLower) {
      return true;
    }
    return false;
  });
}

/**
 * Filters through the given directories and
 * exclude those that matches the given rule
 *
 * @param {String[]} directories - An array of paths
 * @param {RegExp} rule
 * @return {String[]}
 */
function filterByRule(directories, rule) {
  return directories.filter(dir => !rule.test(dir));
}

/**
 * Filters through the given directories and
 * exclude those that matches the given rule
 *
 * @param {String[]} directories - An array of paths
 * @param {RegExp[]} rules - An array of rules
 * @return {String[]}
 */
function filterByMultipleRules(directories, rules = []) {
  let filtered = directories.concat([]);
  rules.forEach(rule => {
    filtered = filterByRule(filtered, rule);
  });
  return filtered;
}

module.exports = {
  matchFiles,
  filterByRule,
  filterByMultipleRules,
};
