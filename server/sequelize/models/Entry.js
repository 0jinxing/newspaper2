const { STRING, TEXT, INTEGER, DATE } = require('sequelize');
const sequelize = require('../sequelize');

const Entry = sequelize.define(
  'Entry',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    link: {
      type: STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    date: {
      type: DATE,
      allowNull: false,
      commit: '`Entry` 更新时间，区别于 update_at',
    },
    description: {
      type: TEXT,
      allowNull: false,
    },
    summary: {
      type: TEXT,
    },
    siteId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['title'] }],
  }
);

module.exports = Entry;
