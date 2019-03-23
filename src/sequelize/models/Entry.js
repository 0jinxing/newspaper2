import { STRING, TEXT, INTEGER, DATE } from 'sequelize';
import sequelize from '../sequelize';

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
    source: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['title'] }],
  }
);

export default Entry;
