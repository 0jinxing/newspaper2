const chalk = require('chalk');

require('dotenv').config();

const models = require('../server/sequelize');
const db = require('../server/sequelize/sequelize');

Promise.all(
  Object.values(models).map(model => {
    console.log(chalk.green(`${model.name} sync`));
    return model.sync({ force: true });
  })
).then(() => {
  db.close();
  console.log(chalk.hex('#1890FF')('models sync success'));
});
