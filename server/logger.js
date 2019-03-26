const winston = require('winston');
const moment = require('moment');

const { format } = winston;

const transportFile = new winston.transports.File({
  level: 'info',
  dirname: '.logs',
  filename: `${moment().format('YYYY-MM-DD')}.info`,
  format: format.combine(format.timestamp(), format.json()),
});

const transportStd = new winston.transports.Console({
  level: 'debug',
  format: format.combine(format.colorize(), format.simple()),
});

const logger = winston.createLogger({
  transports: [transportFile, transportStd],
  exitOnError: false,
});

module.exports = logger;
