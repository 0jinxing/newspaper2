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
const LongType = require('./long.scalar');
const createPaginationType = require('../utils/create-pagination-type');
const { withAuth } = require('../utils/auth');

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
    timestamp: {
      type: LongType,
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

const ownSubscriptionList = withAuth({
  type: SitePaginationType,
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
    const { SiteModel, RelUserSiteModel } = models;
    // 关系表数据
    const relList = await RelUserSiteModel.findAll({
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
    timestamp: {
      type: LongType,
    },
  },
  resolve: async (root, args, { ctx, models }) => {
    const { userId, offset = 0, limit } = args;
    const { RelUserSiteModel, SiteModel } = models;
    const relList = await RelUserSiteModel.findAll({
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
const addOrCreateSiteForMe = withAuth({
  type: SiteType,
  args: {
    link: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { auth, ctx, models, db }) => {
    const { link } = args;
    const { SiteModel, RelUserSiteModel, EntryModel } = models;
    return db.transaction(async t => {
      const { id: userId } = auth;
      const parser = new RssParser();
      const parseResult = await parser.parseURL(link);
      const [existOrNewSite, created] = await SiteModel.findOrCreate({
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
        siteId: existOrNewSite.id,
      }));
      if (created) {
        // 新建 site，全部插入
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
      await RelUserSiteModel.findOrCreate({
        where: { userId, siteId: existOrNewSite.id },
        transaction: t,
      });
      return existOrNewSite;
    });
  },
});

const deleteOwnSite = withAuth({
  type: SiteType,
  args: {
    link: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { link } = args;
    const { RelUserSiteModel, SiteModel } = models;
    const delSite = await SiteModel.findOne({ where: { link } });
    const affected = await RelUserSiteModel.destroy({
      where: { siteId: delSite.id, userId: auth.id },
    });
    if (affected) {
      return delSite;
    } else {
      throw new Error(`Delete error, ${affected} row affected`);
    }
  },
});

module.exports = {
  SiteType,
  SitePaginationType,
  query: {
    allSites,
    ownSubscriptionList,
    subscriptionListListOfUser,
  },
  mutation: {
    addOrCreateSiteForMe,
    deleteOwnSite,
  },
};
