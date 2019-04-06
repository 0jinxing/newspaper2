const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} = require('graphql');
const Sequelize = require('sequelize');
const { withAuth } = require('../utils/auth');
const createPaginationType = require('../utils/create-pagination-type');

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    id: {
      type: GraphQLID,
    },
    userId: {
      type: GraphQLID,
    },
    replyId: {
      type: GraphQLID,
    },
    entryId: {
      type: GraphQLID,
    },
    content: {
      type: GraphQLString,
    },
    accepted: {
      type: GraphQLBoolean,
    },
  },
});

const CommentPaginationType = createPaginationType(CommentType, 'CommentPagination');

// query
// 获得所有评论（可能是一个几乎没有用的 query 吧）
const allComments = {
  type: CommentPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { models }) => {
    const { offset = 0, limit } = args;
    const { CommentModel } = models;
    return CommentModel.findAndCountAll(typeof limit === 'number' ? { offset, limit } : { offset });
  },
};

// 获得 entry 的评论
const commentListOfEntry = {
  type: CommentPaginationType,
  args: {
    entryId: {
      type: GraphQLID,
    },
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: (root, args, { models }) => {
    const { entryId, offset = 0, limit } = args;
    const { CommentModel } = models;
    return CommentModel.findAndCountAll({
      where: { entryId },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
};

// 我发出的评论（不是我收到的评论）
const ownCommentList = withAuth({
  type: CommentPaginationType,
  args: {
    offset: {
      type: GraphQLString,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { auth, models }) => {
    const { offset = 0, limit } = args;
    const { id: userId } = auth;
    const { CommentModel } = models;
    return CommentModel.findAndCountAll({
      where: { userId },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

// 我收到的（默认未读）回复，和评论有所区别
const toMeReply = withAuth({
  type: CommentPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    accepted: {
      type: GraphQLBoolean,
    },
  },
  resolve: async (root, args, { auth, models }) => {
    const { offset = 0, limit, accepted = false } = args;
    const { id: userId } = auth;
    const { CommentModel } = models;
    // 获得我发出评论
    const myComments = CommentModel.findAll({ where: { userId } });
    // 找到对应我评论的回复
    return CommentModel.findAndCountAll({
      where: {
        accepted,
        replyId: {
          [Sequelize.Op.in]: myComments.map(c => c.id),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

// 我收到的（默认未读）评论，和回复有所区别
const toMeComment = withAuth({
  type: CommentPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { offset = 0, limit, accepted = false } = args;
    const { id: userId } = auth;
    const { SiteModel, EntryModel, CommentModel } = models;
    // 找到我的 site
    const ownSiteList = await SiteModel.findAll({ where: { userId } });
    // 拿到我的 site 里面所有的 entry
    const ownEntryList = await EntryModel.findAll({
      where: {
        siteId: {
          [Sequelize.Op.in]: ownSiteList.map(s => s.id),
        },
      },
    });
    // 找到我的 entry 对应的未读评论
    return CommentModel.findAndCountAll({
      where: {
        accepted,
        entryId: {
          [Sequelize.Op.in]: ownEntryList.map(e => e.id),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { limit }),
    });
  },
});

// mutation
// 发出评论
const createCommentOrReply = withAuth({
  type: CommentType,
  args: {
    entryId: {
      type: GraphQLID,
    },
    content: {
      type: GraphQLString,
    },
    replyId: {
      type: GraphQLID,
    },
  },
  resolve: async (root, args, { models }) => {
    const { entryId, content, replyId } = args;
    const { id: userId } = auth;
    const { CommentModel } = models;
    return CommentModel.create({
      userId,
      entryId,
      replyId,
      content,
    });
  },
});

// 删除自己发的评论
const deleteOwnCommentOrReply = withAuth({
  type: CommentType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { id } = args;
    const { id: userId } = auth;
    const { CommentModel } = models;
    const delComment = CommentModel.findOne({
      where: {
        id,
        userId,
      },
    });
    await delComment.destroy();
    return delComment;
  },
});

module.exports = {
  CommentType,
  CommentPaginationType,
  query: {
    allComments,
    commentListOfEntry,
    ownCommentList,
    toMeReply,
    toMeComment,
  },
  mutation: {
    createCommentOrReply,
    deleteOwnCommentOrReply,
  },
};
