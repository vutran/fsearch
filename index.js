const path = require('path');
const fs = require('fs');
const co = require('co');
const osHomedir = require('os-homedir');
const glob = require('glob');
const utils = require('./utils');

const defaultOpts = {
  exclude: [
    /^\./,
    /node_modules\//,
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
  const opts = {
  };
  return new Promise(resolve => {
    glob(path.join(dir, '*'), opts, (err, files) => {
      if (!err) {
        resolve(files);
      }
    });
  });
}

/**
 * Matches the input against the list of files
 *
 * - Basename must match
 *
 * @param {String} input - The input
 * @param {Array} files - An array of file paths
 */
function matchFiles(input, files) {
  return files.filter(f => {
    if (path.basename(f).toLowerCase() === input.toLowerCase()) {
      return true;
    }
    return false;
  });
}

/**
 * Find files in a given directory
 *
 * @param {String} input
 * @param {String} dir - A single directory
 * @param {Object} opts - Configure the search options
 * @return {Promise[]} - A Promise of matched files
 */
function findInDirectory(input, dir, opts = defaultOpts) {
  return new Promise(resolve => {
    const searchResults = [];
    getFilesInDirectory(dir)
      .then(results => {
        const filteredResults = matchFiles(input, results);
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
      const filtedResults = utils.filterByMultipleRules(flattened, opts.exclude);
      resolve(filtedResults);
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
  const searchDirs = [
    osHomedir(),
    '/Applications',
  ];
  return new Promise(resolve => {
    findInDirectories(input, searchDirs, opts)
      .then(res => {
        resolve(res || []);
      });
  });
}

fsearch.getFilesInDirectory = getFilesInDirectory;
fsearch.matchFiles = matchFiles;
fsearch.findInDirectory = findInDirectory;

module.exports = fsearch;
