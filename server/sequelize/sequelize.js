const Sequelize = require('sequelize');
const logger = require('../logger');

module.exports = new Sequelize('2newspaper', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    version: true,
    underscored: true,
  },
  logging: false,
});
