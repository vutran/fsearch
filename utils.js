const fs = require('fs');

/**
 * Checks if the given path is a file
 *
 * @param {String} path - The full path to the file/directory
 * @return {Boolean} - Returns true if the input is a file
 */
function isFile(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}

/**
 * Checks if the given path is a directory
 *
 * @param {String} path - The full path to the file/directory
 * @return {Boolean} - Returns true if the input is a directory
 */
function isDirectory(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
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
function filterByMultipleRules(directories, rules) {
  let filtered = directories.concat([]);
  rules.forEach(rule => {
    filtered = filterByRule(filtered, rule);
  });
  return filtered;
}

module.exports = {
  isFile,
  isDirectory,
  filterByRule,
  filterByMultipleRules,
};
