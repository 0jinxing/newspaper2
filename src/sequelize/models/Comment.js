import { INTEGER, TEXT, STRING } from 'sequelize';
import sequelize from '../sequelize';

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

export default Comment;
