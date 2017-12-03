#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const meow = require('meow');
const writePkg = require('write-pkg');
const generatePkg = require('../lib/pkg-gen');
const log = require('../lib/log');

const cli = meow(`
Usage
  $ pack-gen <path>

  Options
    --template=<filename>   The template file to be used for generating the new package.json file.
                            If not provided, <path>/package.tpl.json will be used.

    --source=<filename>     The location of your package.json file.
                            If not provided, the root project directory will be used.

  <path>  The working directory in where generating package.json file

  Examples
  Generate a new package.json file inside the ./package folder
  $ pack-gen package

  Generate a new package.json using the base package.json file located under the src directory
  $ pack-gen package --source=src/package.json

  Generate a new package.json file inside the ./package folder using a my-template.json file as a template
  $ pack-gen package --template=my-template.json

`, {
  flags: {
    template: {
      type: 'string',
      alias: 't'
    },
    source: {
      type: 'string',
      alias: 's',
      default: 'package.json'
    }
  }
});

if (cli.input.length === 0) {
  log.error('Error. Please specify a path in where generating the package.json file.');
  process.exit(1);
}

const src = path.resolve(process.cwd(), cli.flags.source);
const dest = path.resolve(cli.input[0], 'package.json');
let tpl = path.resolve(cli.input[0], 'package.tpl.json');

if (cli.flags.template) {
  tpl = path.resolve(process.cwd(), cli.flags.template);
}

if (!fs.existsSync(tpl)) {
  log.error(`Error. Cannot find any "${cli.flags.template || 'package.tpl.json'}" file inside "${cli.input[0]}".`);
  process.exit(1);
}

if (!fs.existsSync(src)) {
  log.error(`Error. Cannot find any "${cli.flags.source}" file in "${process.cwd()}".`);
  process.exit(1);
}

generatePkg(src, tpl)
  .then(res => {
    writePkg.sync(dest, res);
    log.info(`package.json correnctly generated inside ${path.resolve(process.cwd(), cli.input[0])}.`);
  })
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
