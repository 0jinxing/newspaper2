const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const RelUserSite = sequelize.define(
  'relUserSite',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    siteId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'site_id',
    },
  },
  {
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['site_id'],
      },
    ],
    freezeTableName: true,
    tableName: 'rel_user_site',
  }
);

module.exports = RelUserSite;
