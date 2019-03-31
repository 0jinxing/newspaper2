const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');
const moment = require('moment');
const RssParser = require('rss-parser');
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
  },
  resolve: async (root, args, { auth, ctx, models, db }) => {
    const { link } = args;
    const { FeedModel, UserFeedModel, EntryModel } = models;
    db.transaction(async t => {
      const { id: userId } = auth;
      const parser = new RssParser();
      const rss = parser.parseURL(link);
      const [existOrNewFeed, created] = await FeedModel.findOrCreate(
        {
          where: { link },
          defaults: { title: rss.title, updated: rss.updated },
        },
        { transaction: t }
      );
      // 转换格式
      const enterObjectArray = rss.items.map(item => ({
        title: item.title,
        link: item.link,
        updated: +moment(item.isoDate),
        content: item.content,
        snippet: item.contentSnippet,
        feedId: existOrNewFeed.id,
      }));
      if (created) {
        // 新建 feed，全部插入
        EntryModel.bulkCreate(enterObjectArray, { transaction: t });
      } else {
        // 不是新建的，需要判断是否为更新的内容
        enterObjectArray.map(eo => {
          // EntryModel.findOrCreate()
        });
      }
      rss.items.forEach(e => {
        // @TODO 判断是否已经存在
        if (created) {
          // feed 为新建的，无需判断是否已经存在，直接插入
          EntryModel.create({
            title: e.title,
            link: e.link,
            updated: +moment(e.isoDate),
            content: e.content,
            snippet: e.contentSnippet,
            feedId: existOrNewFeed.id,
          });
        } else {
          // feed 为已有的，判断是否已经存在或者内容存在更改
        }
      });
      const uf = await UserFeedModel.create({ userId, feedId: newFeed.id }, { transaction: t });
      return newFeed;
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
