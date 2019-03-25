const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const UserFeed = sequelize.define(
  'userFeed',
  {
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
    feedId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'feed_id',
    },
  },
  {
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['feed_id'],
      },
    ],
    freezeTableName: true,
    tableName: 'user_feed',
  }
);

module.exports = UserFeed;
