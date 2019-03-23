import { STRING, INTEGER } from 'sequelize';
import sequelize from '../sequelize';

const User = sequelize.define('user', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [0, 16],
    },
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      len: [6, 64],
    },
  },
  sale: {
    type: STRING,
    allowNull: false,
  },
  avatar: STRING,
  wechat: STRING,
  github: STRING,
});

export default User;
