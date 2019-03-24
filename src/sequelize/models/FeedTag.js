const { INTEGER } = require('sequelize');
const sequelize = require('../sequelize');

const FeedTag = sequelize.define(
  'feedTag',
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    feedId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      field: 'feed_id',
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
        fields: ['feed_id'],
      },
      {
        fields: ['tag_id'],
      },
    ],
    freezeTableName: true,
    tableName: 'feed_tag',
  }
);

module.exports = FeedTag;
