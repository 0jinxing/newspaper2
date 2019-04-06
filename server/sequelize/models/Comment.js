const { INTEGER, TEXT, STRING, BOOLEAN } = require('sequelize');
const sequelize = require('../sequelize');

const Comment = sequelize.define(
  'comment',
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
    entryId: {
      type: INTEGER.UNSIGNED,
      field: 'entry_id',
    },
    replyId: {
      type: INTEGER.UNSIGNED,
      field: 'reply_id',
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
