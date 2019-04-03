const { STRING, INTEGER, DATE } = require('sequelize');
const sequelize = require('../sequelize');

const Site = sequelize.define(
  'site',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    // 网站的拥有者，不是订阅者
    userId: {
      type: INTEGER.UNSIGNED,
      field: 'user_id',
    },
    link: {
      type: STRING,
      unique: true,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    updated: {
      type: DATE,
      commit: '`site` 更新时间，区别于 update_at',
    },
  },
  {
    indexes: [{ fields: ['title'] }],
  }
);

module.exports = Site;
