const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

// 关系表
const Subscription = sequelize.define(
  'subscription',
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
    siteId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'site_id',
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
