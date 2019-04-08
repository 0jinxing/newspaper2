const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
  GraphQLUnionType,
} = require('graphql');
const Sequelize = require('sequelize');
const { SiteType } = require('./site.schema');
const { withAuth } = require('../utils/auth');

const FolderType = new GraphQLObjectType({
  name: 'Folder',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
  },
});

// folder or site 可以存在于根目录
const FolderItemType = new GraphQLUnionType({
  name: 'FolderItem',
  types: [SiteType, FolderType],
});

// query
const ownRootFolderList = withAuth({
  type: FolderType,
  resolve: async (root, args, { models, auth }) => {
    const { id: userId } = auth;
    const { FolderModel, FolderPathModel, SiteModel } = models;
    // 获得根目录的内容
    const rootPathList = await FolderPathModel.findAll({
      where: {
        userId,
        isRoot: true,
      },
    });
    // 区分出文件还是文件夹
    const folderPathList = rootPathList.filter(rp => !rp.isSite);
    const sitePathList = rootPathList.filter(rp => rp.isSite);
    // 取出相应内容
    const folderList = await FolderModel.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: folderPathList.map(fp => fp.descendant),
        },
      },
      order: [['name']],
    });
    const siteList = await SiteModel.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: sitePathList.map(sp => sp.descendant),
        },
      },
      order: [['title']],
    });
  },
});

const subFolderList = withAuth({
  type: FolderType,
  args: {
    ancestor: {
      type: GraphQLID,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { ancestor } = args;
    const { id: userId } = auth;
    const { FolderModel, FolderPathModel } = models;

    return FolderPathModel.findAll({
      where: {
        userId,
        ancestor,
        depth: 1,
      },
    });
  },
});

module.exports = {
  FolderType,
  query: {
    ownFolders,
  },
};
