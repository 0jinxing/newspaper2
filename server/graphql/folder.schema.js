const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');
const { withAuth } = require('../utils/auth');
const createPaginationType = require('../utils/create-pagination-type');

const FolderType = new GraphQLObjectType({
  name: 'Folder',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    children: {
      type: new GraphQLList(FolderType),
    },
  },
});

// query
// 树形结构，没有分页，返回全部
const ownFolders = withAuth({
  type: FolderPaginationType,
  resolve: async (root, args, { models, auth }) => {
    const { id: userId } = auth;
    const { FolderModel, FolderPathModel } = models;
    const allPath = await FolderPathModel.findAll({
      where: {
        userId,
      },
    });
    const rootList = allPath.filter(p => p.isRoot);
    return rootList.map(rp => {
      
    });
  },
});

module.exports = {
  FolderType,
  query: {
    ownFolders,
  },
};
