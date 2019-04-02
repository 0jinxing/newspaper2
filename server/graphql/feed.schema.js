const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');
const Sequelize = require('sequelize');
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
  resolve: async (root, args, { ctx, models }) => {
    const { offset = 0, limit } = args;
    const { FeedModel } = models;
    return limit
      ? FeedModel.findAndCountAll({ offset, limit })
      : FeedModel.findAndCountAll({ offset });
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
    const { offset = 0, limit } = args;
    const { FeedModel, RelUserFeedModel } = models;
    // 关系表数据
    const relList = await RelUserFeedModel.findAll({
      where: {
        userId: auth.id,
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
    // 根据关系表数据，获得自己的订阅
    return FeedModel.findAndCountAll({
      where: {
        id: {
          [Sequelize.Op.in]: relList.map(rel => rel.feedId),
        },
      },
    });
  },
});

const feedListOfUser = {
  type: FeedPaginationType,
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
    const { id, offset = 0, limit } = args;
    const { RelUserFeedModel, FeedModel } = models;
    const relList = await RelUserFeedModel.findAll({
      where: { userId: id },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
    return FeedModel.findAndCountAll({
      where: {
        id: {
          [Sequelize.Op.in]: relList.map(rel => rel.feedId),
        },
      },
    });
  },
};

// mutation
const addOrCreateFeedForOwner = withAuth({
  type: FeedType,
  args: {
    link: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { auth, ctx, models, db }) => {
    const { link } = args;
    const { FeedModel, RelUserFeedModel, EntryModel } = models;
    return db.transaction(async t => {
      const { id: userId } = auth;
      const parser = new RssParser();
      const parseResult = await parser.parseURL(link);
      const [existOrNewFeed, created] = await FeedModel.findOrCreate({
        where: { link },
        defaults: { title: parseResult.title, updated: +moment(parseResult.lastBuildDate) },
        transaction: t,
      });
      // 转换格式
      const enterObjectArray = parseResult.items.map(item => ({
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
        // 删除旧的，插入新的
        await EntryModel.destroy(
          {
            where: {
              link: { [Sequelize.Op.in]: enterObjectArray.map(eo => eo.link) },
            },
          },
          { transaction: t }
        );
        await EntryModel.bulkCreate(enterObjectArray, { transaction: t });
      }
      // 创建对应记录（存在则不创建）
      await RelUserFeedModel.findOrCreate({
        where: { userId, feedId: existOrNewFeed.id },
        transaction: t,
      });
      return existOrNewFeed;
    });
  },
});

const deleteOwnerFeed = withAuth({
  type: FeedType,
  args: {
    link: {
      type: GraphQLID,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { link } = args;
    const { RelUserFeedModel, FeedModel } = models;
    const delFeed = await FeedModel.findOne({ where: { link } });
    const affected = await RelUserFeedModel.destroy({
      where: { feedId: delFeed.id, userId: auth.id },
    });
    if (affected) {
      return delFeed;
    } else {
      throw new Error(`Delete error, ${affected} row affected`);
    }
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
    addOrCreateFeedForOwner,
    deleteOwnerFeed,
  },
};
