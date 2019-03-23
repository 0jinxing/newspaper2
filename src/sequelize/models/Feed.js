import { STRING, INTEGER, DATE } from 'sequelize';
import sequelize from '../sequelize';

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
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['title'] }],
  }
);

export default Feed;
