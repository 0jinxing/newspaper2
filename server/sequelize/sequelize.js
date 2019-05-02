const Sequelize = require('sequelize');
const logger = require('../logger');

const dbName = process.env.DB_NAME || '2newspaper';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '123456';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbDialect = process.env.DB_DIALECT || 'mysql';

module.exports = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  define: {
    version: true,
    underscored: true,
  },
  logging: false,
});
