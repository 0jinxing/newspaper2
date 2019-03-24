const glob = require('glob');

glob.sync('src/sequelize/models/**/*.js', { nodir: true, realpath: true }).forEach(p => {
  const model = require(p);
  const modelName = model.name.replace(/^\S/, s => s.toUpperCase()) + 'Model';
  module.exports[modelName] = model;
});
