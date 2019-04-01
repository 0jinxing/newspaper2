const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const RelUserFeed = sequelize.define(
  'relUserFeed',
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
    tableName: 'rel_user_feed',
  }
);

module.exports = RelUserFeed;
