const { STRING, INTEGER, DATE } = require('sequelize');
const sequelize = require('../sequelize');

const Feed = sequelize.define(
  'feed',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
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
      commit: '`Feed` 更新时间，区别于 update_at',
    },
  },
  {
    indexes: [{ fields: ['title'] }],
  }
);

module.exports = Feed;
