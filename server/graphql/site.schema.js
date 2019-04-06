const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');
const Sequelize = require('sequelize');
const moment = require('moment');
const RssParser = require('rss-parser');
const DateType = require('./date.scalar');
const createPaginationType = require('../utils/create-pagination-type');
const { withAuth } = require('../utils/auth');
const getFavicon = require('../utils/get-favicon');

const SiteType = new GraphQLObjectType({
  name: 'Site',
  fields: {
    id: {
      type: GraphQLID,
    },
    userId: {
      type: GraphQLID,
    },
    link: {
      type: GraphQLString,
    },
    favicon: {
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

const SitePaginationType = createPaginationType(SiteType, 'SitePagination');

// query
const allSites = {
  type: SitePaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { ctx, models }) => {
    const { offset = 0, limit } = args;
    const { SiteModel } = models;
    return limit
      ? SiteModel.findAndCountAll({ offset, limit })
      : SiteModel.findAndCountAll({ offset });
  },
};

// 获得自己的订阅列表
const ownSubscriptionList = withAuth({
  type: SitePaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { auth, ctx, models }) => {
    const { offset = 0, limit } = args;
    const { SiteModel, SubscriptionModel } = models;
    // 关系表数据
    const relList = await SubscriptionModel.findAll({
      where: {
        userId: auth.id,
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
    // 根据关系表数据，获得自己的订阅
    return SiteModel.findAndCountAll({
      where: {
        id: {
          [Sequelize.Op.in]: relList.map(rel => rel.siteId),
        },
      },
    });
  },
});

// 获得某个用户的订阅列表
const subscriptionListListOfUser = {
  type: SitePaginationType,
  args: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { ctx, models }) => {
    const { userId, offset = 0, limit } = args;
    const { SubscriptionModel, SiteModel } = models;
    const relList = await SubscriptionModel.findAll({
      where: { userId },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
    return SiteModel.findAndCountAll({
      where: {
        id: {
          [Sequelize.Op.in]: relList.map(rel => rel.siteId),
        },
      },
    });
  },
};

// mutation
// 订阅网站
const subscribeSite = withAuth({
  type: SiteType,
  args: {
    link: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { auth, ctx, models, db }) => {
    const { link } = args;
    const { SiteModel, SubscriptionModel, EntryModel } = models;
    return db.transaction(async t => {
      const { id: userId } = auth;
      const parser = new RssParser();
      const parseResult = await parser.parseURL(link);
      const [existOrNewSite, created] = await SiteModel.findOrCreate({
        where: { link },
        defaults: {
          title: parseResult.title,
          updated: +moment(parseResult.lastBuildDate),
          favicon: await getFavicon(link),
        },
        transaction: t,
      });
      // 转换格式
      const enterObjectArray = parseResult.items.map(item => ({
        title: item.title,
        link: item.link,
        content: item.content,
        updated: +moment(item.isoDate),
        snippet: item.contentSnippet,
        siteId: existOrNewSite.id,
      }));
      if (created) {
        // 新建 site，全部插入
        EntryModel.bulkCreate(enterObjectArray, { transaction: t });
      } else {
        // 删除旧的
        await EntryModel.destroy(
          {
            where: {
              link: { [Sequelize.Op.in]: enterObjectArray.map(eo => eo.link) },
            },
          },
          { transaction: t }
        );
        // 插入新的
        await EntryModel.bulkCreate(enterObjectArray, { transaction: t });
        // 更新对应 site 的 updated
        await existOrNewSite.update({
          updated: +moment(parseResult.lastBuildDate),
        });
      }
      // 创建对应记录（存在则不创建）
      await SubscriptionModel.findOrCreate({
        where: { userId, siteId: existOrNewSite.id },
        transaction: t,
      });
      return existOrNewSite;
    });
  },
});

// 取消订阅网站
const unsubscribeSite = withAuth({
  type: SiteType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { id } = args;
    const { SubscriptionModel, SiteModel } = models;
    const currentSite = await SiteModel.findOne({ where: { id } });
    const affected = await SubscriptionModel.destroy({
      where: { siteId: currentSite.id, userId: auth.id },
    });
    if (affected) {
      return currentSite;
    } else {
      throw new Error(`Delete error, ${affected} row affected`);
    }
  },
});

// @TODO
// 创建一个自己的网站（生成一个 app_token）
// 删除自己的网站

module.exports = {
  SiteType,
  SitePaginationType,
  query: {
    allSites,
    ownSubscriptionList,
    subscriptionListListOfUser,
  },
  mutation: {
    subscribeSite,
    unsubscribeSite,
  },
};
