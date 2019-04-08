const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

// 关系表
const Subscription = sequelize.define(
  'Subscription',
  {
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
  },
  {
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['site_id'],
      },
    ],
  }
);

module.exports = Subscription;
