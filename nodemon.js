const path = require('path');
const nodemon = require('nodemon');
const watch = require('watch');
const chalk = require('chalk');

const color = {
  log: 'black',
  info: 'yellow',
  status: 'green',
  detail: 'yellow',
  fail: 'red',
  error: 'red',
};

const mon = nodemon({
  script: 'server/index.js',
  watch: ['server/**/*.js'],
}).on('log', ({ type, message }) => {
  if (typeof chalk[color[type]] === 'function') {
    console.log(chalk[color[type]](message));
  } else if (typeof console[type] === 'function') {
    console[type](message);
  } else {
    console.log(message);
  }
});

// param page auto restart
watch.createMonitor(path.resolve('client/pages'), monitor => {
  monitor.on('created', f => {
    const filename = f.split(path.sep).slice(-1)[0];
    if (/\$[0-9A-Za-z\-]+\.js(x?)/.test(filename)) {
      mon.emit('restart');
    }
  });
  monitor.on('removed', f => {
    const filename = f.split(path.sep).slice(-1)[0];
    if (/\$[0-9A-Za-z\-]+\.js(x?)/.test(filename)) {
      mon.emit('restart');
    }
  });
});
