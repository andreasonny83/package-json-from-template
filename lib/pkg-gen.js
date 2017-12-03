'use strict';
const fs = require('fs');
const readPkg = require('read-pkg');
const replaceString = require('replace-string');

module.exports = (src, tpl) => {
  return new Promise((resolve, reject) => {
    const json = readPkg.sync(src);
    const name = json.name;
    const version = json.version;

    fs.readFile(tpl, 'utf8', (err, contents) => {
      if (err) {
        reject(err);
      }

      const out = contents
        .split('\n')
        .map(line => {
          line = replaceString(line, '{pkg-name}', name);
          line = replaceString(line, '{pkg-version}', version);
          return line;
        })
        .join('\n');

      resolve(JSON.parse(out));
    });
  });
};
