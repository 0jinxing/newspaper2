const { STRING, INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

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
  },
});

module.exports = Tag;
