const { GraphQLID, GraphQLInt, GraphQLString, GraphQLObjectType } = require('graphql');
const Sequelize = require('sequelize');
const DateType = require('./date.scalar');
const { SiteType } = require('./site.schema');
const { withAuth } = require('../utils/auth');
const createPaginationType = require('../utils/create-pagination-type');

const EntryPaginationType = createPaginationType(SiteType, 'EntryPagination');

const EntryType = new GraphQLObjectType({
  name: 'Entry',
  fields: {
    id: {
      type: GraphQLID,
    },
    siteId: {
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

const entryListOfSite = {
  type: EntryPaginationType,
  args: {
    siteId: {
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
    const { siteId, offset = 0, limit } = args;
    return EntryModel.findAndCountAll({
      where: { siteId },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
};

const ownEntryList = withAuth({
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
    const { RelUserSiteModel, EntryModel } = models;
    const { id: userId } = auth;
    const relList = await RelUserSiteModel.findAll({
      where: { userId },
    });
    return EntryModel.findAndCountAll({
      where: {
        siteId: {
          [Sequelize.Op.in]: relList.map(rel => rel.siteId),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

module.exports = {
  EntryType,
  EntryPaginationType,
  query: {
    allEntries,
    entryListOfSite,
    ownEntryList,
  },
};
