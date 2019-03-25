const { INTEGER, TEXT, STRING } = require('sequelize');
const sequelize = require('../sequelize');

const Comment = sequelize.define(
  'comment',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: TEXT,
      allowNull: false,
    },
    link: {
      type: STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
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
