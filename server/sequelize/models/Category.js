const { INTEGER, STRING } = require('sequelize');
const sequelize = require('../sequelize');

const Category = sequelize.define('category', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  parentId: {
    type: INTEGER.UNSIGNED,
    defaultValue: 0,
    allowNull: false,
    field: 'parent_id',
  },
  userId: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  name: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = Category;
