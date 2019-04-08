const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');
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

// query
const ownRootFolders = withAuth({
  type: FolderType,
  resolve: async (root, args, { models, auth }) => {
    const { id: userId } = auth;
    const { FolderModel, FolderPathModel } = models;
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
  resolve: async () => {},
});

module.exports = {
  FolderType,
  query: {
    ownFolders,
  },
};
