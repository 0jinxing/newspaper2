const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
  GraphQLUnionType,
} = require('graphql');
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
const ownRootFolders = withAuth({
  type: FolderType,
  resolve: async (root, args, { models, auth }) => {
    const { id: userId } = auth;
    const { FolderModel, FolderPathModel } = models;
    const root = await FolderModel.findAll({
      where: {
        userId
      }
    })
    const allPath = await FolderPathModel.findAll({
      where: {
        userId,
      },
    });
    const rootList = allPath.filter(p => p.isRoot);
    return rootList.map(rp => {});
  },
});

const ownSubFolders = withAuth({
  type: FolderType,
  args: {
    folderId: {
      type: GraphQLID,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    // const 
  },
});

module.exports = {
  FolderType,
  query: {
    ownFolders,
  },
};
