'use strict';
const chalk = require('chalk');

const log = (level, message) => {
  message = message || '';

  console.error(chalk[level](message));
};

module.exports = {
  error: log.bind(null, 'red'),
  info: log.bind(null, 'cyan'),
  warn: log.bind(null, 'yellow'),
  verbose: log.bind(null, 'gray'),
};
