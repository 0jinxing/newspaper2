const { INTEGER, STRING } = require('sequelize');
const sequelize = require('../sequelize');

const Folder = sequelize.define('Folder', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = Folder;
