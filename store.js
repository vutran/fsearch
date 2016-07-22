const path = require('path');
const Datastore = require('nedb');
const envPaths = require('env-paths');
const appName = require('./package').name;

// path to the cache file
const STORE_PATH = path.join(envPaths(appName).data, 'store.json');

const db = new Datastore({ filename: STORE_PATH });

db.ensureIndex({ fieldName: 'file', unique: true });

/**
 * Loads the data store and returns a Promise when
 * it is successfully loaded.
 *
 * @return {Promise}
 */
function connect() {
  return new Promise((resolve, reject) => {
    db.loadDatabase(err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    })
  });
}

/**
 * Create a doc for the given file.
 *
 * @param {String} file - The file name
 * @return {Object} - The doc to store
 */
function createDoc(file) {
  const dir = path.dirname(file);
  const ext = path.extname(file);
  const base = path.basename(file);
  const name = path.basename(file, ext);
  return {
    file: file,
    dir,
    base, // name + ext
    name,
    ext,
  };
}

/**
 * Stores the file to the cache.
 *
 * @param {String} file
 * @return {Promise} - Resolves to the newly inserted doc
 */
function insert(file) {
  return new Promise((resolve, reject) => {
    db.insert(createDoc(file), (err, newDoc) => {
      if (err) {
        reject(err);
      }
      resolve(newDoc);
    });
  });
}

/**
 * Finds the file from the cache.
 *
 * If no docs are found, returns an empty array.
 *
 * @param {String} file
 * @return {Promise} - Resolves to an array of docs found
 */
function find(file) {
  return new Promise((resolve, reject) => {
    const q = { file };
    db.find(q, (err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
}

/**
 * Finds all files in the given directory
 *
 * If no docs are found, returns an empty array.
 *
 * @param {String} dir
 * @return {Promise} - Resolves to an array of docs found
 */
function findInDir(dir) {
  return new Promise((resolve, reject) => {
    const q = { dir };
    db.find(q, (err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
}

/**
 * Inserts a new document or updates the existing one
 *
 * If the doc exists by the file name, then update it instead
 *
 * @param {String} file
 * @return {Promise} - Resolves to an array of affected docs
 */
function upsert(file) {
  return new Promise((resolve, reject) => {
    const q = { file };
    db.update(q, createDoc(file), { upsert: true }, (err, numAffected, affectedDocs) => {
      if (err) {
        reject(err);
      }
      resolve(affectedDocs);
    });
  });
}

module.exports = {
  connect,
  insert,
  find,
  findInDir,
  upsert,
};
