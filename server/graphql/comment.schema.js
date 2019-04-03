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
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    replyId: {
      type: GraphQLID,
    },
    accepted: {
      type: GraphQLBoolean,
    },
  },
});

const CommentPaginationType = createPaginationType(CommentType, 'CommentPagination');

// query
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

const commentListOfEntry = {
  type: CommentPaginationType,
  args: {
    link: {
      type: GraphQLString,
    },
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: (root, args, { models }) => {
    const { link, offset = 0, limit } = args;
    const { CommentModel } = models;
    return CommentModel.findAndCountAll({
      where: { link },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
};

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

// 我的未读回复，和评论有所区别
const toMeUnacceptedReply = withAuth({
  type: CommentPaginationType,
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
    const { id: userId } = auth;
    const { CommentModel } = models;
    const myComments = CommentModel.findAll({ where: { userId } });
    return CommentModel.findAndCountAll({
      where: {
        accepted: false,
        replyId: {
          [Sequelize.Op.in]: myComments.map(c => c.id),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

// 我的未读评论，和回复有所区别
const toMeUnacceptedComment = withAuth({
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
    const { offset = 0, limit } = args;
    const { id: userId } = auth;
    const { SiteModel, CommentModel } = models;
    const ownSiteList = await SiteModel.findAll({ where: { userId } });
    return CommentModel.findAndCountAll({
      where: {
        accepted: false,
        link: {
          [Sequelize.Op.in]: ownSiteList.map(s => s.link),
        },
      },
      ...(typeof limit === 'number' ? { offset, limit } : { limit }),
    });
  },
});

// mutation
const createComment = withAuth({
  type: CommentType,
  args: {
    link: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { models }) => {
    const { link, content } = args;
    const { id: userId } = auth;
    const { CommentModel } = models;
    return CommentModel.create({
      userId,
      link,
      content,
    });
  },
});

const deleteOwnComment = withAuth({
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

const replyComment = withAuth({
  type: CommentType,
  args: {
    replyId: {
      type: GraphQLID,
    },
    link: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { replyId, link, content } = args;
    const { id: userId } = auth;
    const { CommentModel } = models;
    return CommentModel.create({
      link,
      replyId,
      userId,
      content,
    });
  },
});

module.exports = {
  CommentType,
  CommentPaginationType,
  query: {
    allComments,
    commentListOfEntry,
    ownCommentList,
    toMeUnacceptedReply,
    toMeUnacceptedComment,
  },
  mutation: {
    createComment,
    deleteOwnComment,
    replyComment,
  },
};
