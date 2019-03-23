import { STRING, INTEGER } from 'sequelize';
import sequelize from '../sequelize';

const Tag = sequelize.define('tag', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  color: {
    type: STRING,
    allowNull: false,
  },
});

export default Tag;
