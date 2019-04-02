const { GraphQLID, GraphQLInt, GraphQLString, GraphQLObjectType } = require('graphql');
const Sequelize = require('sequelize');
const DateType = require('./date.scalar');
const { FeedType } = require('./feed.schema');
const { withAuth } = require('../utils/auth');
const createPaginationType = require('../utils/create-pagination-type');

const EntryPaginationType = createPaginationType(FeedType, 'EntryPagination');

const EntryType = new GraphQLObjectType({
  name: 'Entry',
  fields: {
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
    updated: {
      type: DateType,
    },
    content: {
      type: GraphQLString,
    },
    source: FeedType,
  },
});

const allEntries = {
  type: EntryPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { models }) => {
    const { EntryModel } = models;
    const { offset = 0, limit } = args;
    return EntryModel.findAndCountAll(typeof limit === 'number' ? { offset, limit } : { offset });
  },
};

const entryListOfFeed = {
  type: EntryPaginationType,
  args: {
    feedId: {
      type: GraphQLID,
    },
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { ctx, auth, db, models }) => {
    const { EntryModel } = models;
    const { feedId, offset = 0, limit } = args;
    return EntryModel.findAndCountAll({
      where: { feedId },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
};

const ownerEntryList = withAuth({
  type: EntryPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { auth, models }) => {
    const { offset = 0, limit } = args;
    const { RelUserFeedModel, EntryModel } = models;
    const { id: userId } = auth;
    const relList = await RelUserFeedModel.findAll({
      where: { userId },
    });
    return EntryModel.findAndCountAll({
      where: {
        feedId: {
          [Sequelize.Op.in]: relList.map(rel => rel.feedId),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

module.exports = {
  EntryType,
  query: {
    allEntries,
    entryListOfFeed,
    ownerEntryList,
  },
};
