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
    replyId: {
      type: INTEGER.UNSIGNED,
      field: 'reply_id',
    },
    link: {
      type: STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
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
        fields: ['link'],
      },
    ],
  }
);

module.exports = Comment;
