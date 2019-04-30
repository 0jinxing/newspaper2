const { GraphQLID, GraphQLInt, GraphQLString, GraphQLObjectType } = require('graphql');
const Sequelize = require('sequelize');
const moment = require('moment');
const DateType = require('./date.scalar');
const { withAuth } = require('../utils/auth');
const createPaginationType = require('../utils/create-pagination-type');

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
    date: {
      type: DateType,
    },
    description: {
      type: GraphQLString,
    },
    summary: {
      type: GraphQLString,
    },
  },
});

const EntryPaginationType = createPaginationType(EntryType, 'EntryPagination');

// query
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

const todayEntryList = withAuth({
  type: EntryPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { EntryModel, SubscriptionModel } = models;
    const { id: userId } = auth;
    const { offset = 0, limit } = args;
    const subscriptionList = await SubscriptionModel.findAll({
      where: {
        userId,
      },
    });
    return EntryModel.findAndCountAll({
      where: {
        siteId: {
          [Sequelize.Op.in]: subscriptionList.map(s => s.siteId),
        },
        date: {
          [Sequelize.Op.gt]: +moment()
            .subtract(1, 'd')
            .hour(0)
            .minute(0)
            .second(0),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

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

const ownSubscriptionEntryList = withAuth({
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
    const { SubscriptionModel, EntryModel } = models;
    const { id: userId } = auth;
    // 拿到订阅 site 列表
    const relList = await SubscriptionModel.findAll({
      where: { userId },
    });
    // 根据上面的列表拿到 entry
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
    todayEntryList,
    entryListOfSite,
    ownSubscriptionEntryList,
  },
};
