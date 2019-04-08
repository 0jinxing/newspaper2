const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const Like = sequelize.define('Like', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
  },
  siteId: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
  },
  commitId: {
    type: INTEGER.UNSIGNED,
  },
});

module.exports = Like;
