const Sequelize = require('sequelize');
const logger = require('../logger');

module.exports = new Sequelize('2newspaper', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'update_at',
    deletedAt: 'deleted_at',
    version: true,
  },
  logging: logger.info.bind(logger),
  // logging: false,
});
