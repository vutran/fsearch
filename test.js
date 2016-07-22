import path from 'path';
import test from 'ava';
import utils from './utils';
import fsearch from '.';

test('filter by single rule', t => {
  t.plan(1);
  const directories = [
    'VuTran.app',
    'Vu.png',
    'Tran.png',
    '.DS_Store',
    '.log',
  ];
  const rule = /^\./;
  const expected = [
    'VuTran.app',
    'Vu.png',
    'Tran.png',
  ];
  t.deepEqual(utils.filterByRule(directories, rule), expected);
});

test('filter by multiple rules', t => {
  t.plan(1);
  const directories = [
    'VuTran.app',
    'Vu.png',
    'Tran.png',
    '.DS_Store',
    '.log',
  ];
  const rules = [
    /^\./,
    /\.png$/,
  ];
  const expected = [
    'VuTran.app',
  ];
  t.deepEqual(utils.filterByMultipleRules(directories, rules), expected);
});

test('get files in directory', async t => {
  t.plan(1);
  const directory = __dirname;
  const res = await fsearch.getFilesInDirectory(directory);
  t.true(res instanceof Array);
});

test('match files with a given input against a list of files', async t => {
  t.plan(1);
  const input = 'Google Chrome';
  const files = [
    '/Applications/Firefox.app',
    '/Applications/Safari.app',
    '/Applications/Google Chrome.app',
  ];
  const matches = utils.matchFiles(input, files);
  const expected = [
    '/Applications/Google Chrome.app',
  ];
  t.deepEqual(matches, expected);
});

test('find files that matches an input in a given directory', async t => {
  t.plan(1);
  const input = 'package.json';
  const directory = __dirname;
  const results = await fsearch.findInDirectory(input, directory);
  const expected = [
    path.join(__dirname, 'package.json'),
  ];
  t.deepEqual(results, expected);
});

test('find files that matches an input in the current directory', async t => {
  t.plan(1);
  const input = 'package.json';
  const opts = {
    searchDirs: [
      __dirname,
    ],
  };
  const results = await fsearch(input, opts);
  const expected = [
    path.join(__dirname, 'package.json'),
  ];
  t.deepEqual(results, expected);
});
