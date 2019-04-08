const { INTEGER, TEXT, STRING, BOOLEAN } = require('sequelize');
const sequelize = require('../sequelize');

const Comment = sequelize.define(
  'Comment',
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
    entryId: {
      type: INTEGER.UNSIGNED,
    },
    replyId: {
      type: INTEGER.UNSIGNED,
    },
    content: {
      type: TEXT,
      allowNull: false,
    },
    accepted: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['entry_id'],
      },
      {
        fields: ['reply_id'],
      },
    ],
  }
);

module.exports = Comment;
