import path from 'path';
import fs from 'fs';
import test from 'ava';
import execa from 'execa';
import tempfile from 'tempfile';
import del from 'del';
import readPkg from 'read-pkg';

function read(...args) {
  return fs.readFileSync(path.join(...args), 'utf8');
}

test.beforeEach(() => {
  del.sync([path.resolve(process.cwd(), 'test/mocks/**/package.json')]);
});

test('a path must be specified', async t => {
  const error = await t.throws(execa('./bin/cli.js'));

  t.is(error.code, 1);
  t.is(
    error.stderr,
    'Error. Please specify a path in where generating the package.json file.\n');
});

test('a valid path must be specified', async t => {
  const error = await t.throws(execa('./bin/cli.js', ['test']));

  t.is(error.code, 1);
  t.is(
    error.stderr,
    'Error. Cannot find any "package.tpl.json" file inside "test".\n');
});

test('a `package.tpl.json` must be present in the path', async t => {
  t.context.tmp = tempfile();
  const cwd = path.join(t.context.tmp, 'cwd');
  fs.mkdirSync(t.context.tmp);
  fs.mkdirSync(cwd);
  const error = await t.throws(execa('./bin/cli.js', [cwd]));

  t.is(error.code, 1);
  t.is(
    error.stderr,
    'Error. Cannot find any "package.tpl.json" ' +
    `file inside "${path.join(t.context.tmp, 'cwd')}".\n`);
});

test('should generate a `package.json` file', async t => {
  const mockPkg = '{}\n';
  t.context.tmp = tempfile();
  fs.mkdirSync(t.context.tmp);
  fs.mkdirSync(path.join(t.context.tmp, 'cwd'));
  fs.writeFileSync(path.join(t.context.tmp, 'cwd/package.tpl.json'), mockPkg);
  await execa('./bin/cli.js', [path.join(t.context.tmp, 'cwd')]);

  t.is(
    read(t.context.tmp, 'cwd/package.json'),
    read(t.context.tmp, 'cwd/package.tpl.json'));
});

test('should accept a source flag', async t => {
  const mockPkg = '{}\n';

  t.context.tmp = tempfile();
  fs.mkdirSync(t.context.tmp);
  fs.mkdirSync(path.join(t.context.tmp, 'cwd'));
  fs.writeFileSync(path.join(t.context.tmp, 'cwd/package.tpl.json'), mockPkg);

  await execa('./bin/cli.js', [
    path.join(t.context.tmp, 'cwd'),
    `--source=test/source/package.json`
  ]);

  t.is(
    read(t.context.tmp, 'cwd/package.json'),
    read(t.context.tmp, 'cwd/package.tpl.json'));
});

test('should not replace anything if no placeholder is provided in the template', async t => {
  await execa('./bin/cli.js', ['test/mocks/001']);
  await execa('./bin/cli.js', ['test/mocks/002']);

  t.is(read('test/mocks/001/package.json'), read('test/mocks/001/package.tpl.json'));
  t.is(read('test/mocks/002/package.json'), read('test/mocks/002/package.tpl.json'));
});

test('should replace the name field if the placeholder is provided in the template', async t => {
  const target = path.resolve(process.cwd(), 'test/mocks/003');
  await execa('./bin/cli.js', [
    target,
    '--source=test/source/package.json'
  ]);

  const sourceName = readPkg.sync(path.resolve('test/source/package.json')).name;
  const destName = readPkg.sync(target).name;

  t.is(destName, sourceName);
});

test('should not replace the version number if the placeholder is not provided in the template', async t => {
  const target = path.resolve(process.cwd(), 'test/mocks/003');
  await execa('./bin/cli.js', [
    target,
    '--source=test/source/package.json'
  ]);

  const sourceName = readPkg.sync(path.resolve('test/source/package.json')).name;
  const sourceVersion = readPkg.sync(path.resolve('test/source/package.json')).version;
  const destName = readPkg.sync(target).name;
  const destVersion = readPkg.sync(target).version;

  t.is(destName, sourceName);
  t.not(destVersion, sourceVersion);
});

test('should replace both name and version when both placeholders are present in the template', async t => {
  const target = path.resolve(process.cwd(), 'test/mocks/004');
  await execa('./bin/cli.js', [
    target,
    '--source=test/source/package.json'
  ]);

  const sourceName = readPkg.sync(path.resolve('test/source/package.json')).name;
  const sourceVersion = readPkg.sync(path.resolve('test/source/package.json')).version;
  const destName = readPkg.sync(target).name;
  const destVersion = readPkg.sync(target).version;

  t.is(destName, sourceName);
  t.is(destVersion, sourceVersion);
});
