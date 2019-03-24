const Sequelize = require('sequelize');

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
});
