const { INTEGER, STRING, BOOLEAN } = require('sequelize');
const sequelize = require('../sequelize');

// Closure table 存储树形结构
const FolderPath = sequelize.define('folder_path', {
  id: {
    type: INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  ancestor: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
  },
  // 子节点（可以方便理解为当前理解）
  descendant: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
  },
  depth: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  userId: {
    type: INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  isSite: {
    type: BOOLEAN,
    // @ true? descendant = site_id: folder_id
    defaultValue: false,
    allowNull: false,
    field: 'is_site',
  },
});

module.exports = FolderPath;
