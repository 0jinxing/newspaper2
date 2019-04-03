const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const RelSiteTag = sequelize.define(
  'relSiteTag',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    siteId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'site_id',
    },
    tagId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'tag_id',
    },
  },
  {
    indexes: [
      {
        fields: ['site_id'],
      },
      {
        fields: ['tag_id'],
      },
    ],
    freezeTableName: true,
    tableName: 'rel_site_tag',
  }
);

module.exports = RelSiteTag;
