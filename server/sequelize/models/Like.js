const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const Like = sequelize.define('like', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  siteId: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
    field: 'site_id',
  },
  commitId: {
    type: INTEGER.UNSIGNED,
    field: 'commit_id',
  },
});

module.exports = Like;
