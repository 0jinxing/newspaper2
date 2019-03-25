const chalk = require('chalk');
const models = require('../server/sequelize');

Object.values(models).forEach(model => {
  model.sync({ force: true });
  console.log(chalk.green(`${model.name} is sync`));
});

console.log(chalk.hex('#1890FF')('models sync success'));
