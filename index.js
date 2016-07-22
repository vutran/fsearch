const path = require('path');
const co = require('co');
const osHomedir = require('os-homedir');
const glob = require('glob');
const deepAssign = require('deep-assign');
const utils = require('./utils');

const defaultOpts = {
  searchDirs: [
    osHomedir(),
    '/Applications',
  ],
  exclude: [
    /^\./,
    /node_modules/,
    /.log$/,
  ],
};

/**
 * Get all files in the given directory/directories
 *
 * @param {String} dir - A single directory
 * @return {Promise} - A Promise of an array of file paths
 */
function getFilesInDirectory(dir) {
  return new Promise(resolve => {
    glob(path.join(dir, '*'), {}, (err, files) => {
      if (!err) {
        resolve(files);
      }
    });
  });
}

/**
 * Find files in a given directory
 *
 * @param {String} input
 * @param {String} dir - A single directory
 * @return {Promise[]} - A Promise of matched files
 */
function findInDirectory(input, dir) {
  return new Promise(resolve => {
    getFilesInDirectory(dir)
      .then(results => {
        const filteredResults = utils.matchFiles(input, results);
        resolve(filteredResults);
      });
  });
}

/**
 * Find files in multiple directories
 *
 * @param {String} input
 * @param {String} dir - An array of directories
 * @param {Object} opts - Configure the search options
 * @return {Promise[]} - A Promise of matched files
 */
function findInDirectories(input, dirs, opts = defaultOpts) {
  return new Promise(resolve => {
    co(function * () {
      const promises = [];
      dirs.forEach(dir => {
        promises.push(findInDirectory(input, dir));
      });
      const results = yield promises;
      const flattened = results.reduce((a, b) => a.concat(b));
      const filteredResults = utils.filterByMultipleRules(flattened, opts.exclude);
      resolve(filteredResults);
    });
  });
}

/**
 * Does a file search for the given input.
 *
 * @param {String} input
 * @param {Object} opts - Configure the search options
 * @return {Promise}
 */
function fsearch(input, opts = defaultOpts) {
  const mergedOpts = deepAssign({}, opts);
  return new Promise(resolve => {
    findInDirectories(input, mergedOpts.searchDirs, opts)
      .then(res => {
        resolve(res || []);
      });
  });
}

fsearch.getFilesInDirectory = getFilesInDirectory;
fsearch.findInDirectory = findInDirectory;

module.exports = fsearch;
