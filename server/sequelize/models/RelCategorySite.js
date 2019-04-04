const { INTEGER, TEXT, STRING, BOOLEAN } = require('sequelize');
const sequelize = require('../sequelize');

const RelCategorySite = sequelize.define(
  'rel_category_site',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'category_id',
    },
    siteId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'site_id',
    },
  },
  {
    freezeTableName: true,
    tableName: 'rel_category_site',
  }
);

module.exports = RelCategorySite;
