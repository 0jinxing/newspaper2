const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');
const DateType = require('./date.scalar');
const LongType = require('./long.scalar');
const createPaginationType = require('../utils/create-pagination-type');
const { withAuth } = require('../utils/auth');

const FeedType = new GraphQLObjectType({
  name: 'Feed',
  fields: {
    id: {
      type: GraphQLID,
    },
    link: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    updated: {
      type: DateType,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
  },
});

const FeedPaginationType = createPaginationType(FeedType, 'FeedPagination');

// query
const allFeedList = {
  type: new GraphQLList(FeedType),
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    timestamp: {
      type: LongType,
    },
  },
  resolve: async (root, args, { ctx, models }) => {
    const { offset, limit } = args;
    const { FeedModel } = models;
    return FeedModel.findAndCountAll({ offset, limit });
  },
};

const ownFeedList = withAuth({
  type: FeedPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    timestamp: {
      type: LongType,
    },
  },
  resolve: async (root, args, { auth, ctx, models }) => {
    const { offset, limit } = args;
    const { FeedModel } = models;
    return FeedModel.findAndCountAll({
      where: {
        id: auth.id,
      },
      offset,
      limit,
    });
  },
});

const feedListOfUser = {
  type: new GraphQLList(FeedType),
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    timestamp: {
      type: LongType,
    },
  },
  resolve: async (root, args, { ctx, models }) => {
    const { id, offset, limit } = args;
    const { FeedModel } = models;
    return FeedModel.findAndCountAll({
      where: {
        id,
      },
      offset,
      limit,
    });
  },
};

// mutation
const createFeed = withAuth({
  type: FeedType,
  args: {
    link: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
  },
  resolve: async (root, args, { auth, ctx, models, db }) => {
    const { link, title, tags } = args;
    const { TagModel, FeedModel, FeedTagModel, UserFeedModel } = models;
    db.transaction(async t => {
      const feed = await FeedModel.create({ link, title }, { transaction: t });
      // @TODO
    });
  },
});

module.exports = {
  FeedType,
  FeedPaginationType,
  query: {
    allFeedList,
    ownFeedList,
    feedListOfUser,
  },
  mutation: {
    createFeed,
  },
};
