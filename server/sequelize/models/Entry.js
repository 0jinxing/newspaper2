const { STRING, TEXT, INTEGER, DATE } = require('sequelize');
const sequelize = require('../sequelize');

const Entry = sequelize.define(
  'entry',
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
      unique: true,
      validate: {
        isUrl: true,
      },
    },
    updated: {
      type: DATE,
      allowNull: false,
      commit: '`Entry` 更新时间，区别于 update_at',
    },
    content: {
      type: TEXT,
      allowNull: false,
    },
    snippet: {
      type: TEXT,
    },
    feedId: {
      type: INTEGER.UNSIGNED,
      field: 'feed_id',
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['title'] }],
    paranoid: false,
  }
);

module.exports = Entry;
