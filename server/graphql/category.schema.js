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

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLID,
    },
  },
});

const CategoryPaginationType = createPaginationType(CategoryType, 'CategoryPagination');

// query
const ownCategories = withAuth({
  type: CategoryPaginationType,
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { offset, limit } = args;
    const { id: userId } = auth;
    const { CategoryModel } = models;
    CategoryModel.findAndCountAll({
      where: {
        userId,
      },
      ...(typeof limit === 'number' ? { offset, limit } : { offset }),
    });
  },
});

// mutation
const createCategory = withAuth({
  type: CategoryType,
  args: {
    parentId: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { parentId, name } = args;
    const { id: userId } = auth;
    const { CategoryModel } = models;
    const category = await CategoryModel.create({
      name,
      userId,
      parentId,
    });
    return category;
  },
});

// @TODO
const deleteCategory = withAuth({
  type: CategoryType,
  args: {
    id: {
      type: GraphQLID,
    },
    // 在分类存在内容时，非强制删除失败，强制则删除该分类下的所有内容
    force: {
      type: GraphQLBoolean,
    },
  },
  resolve: async (root, args, { models, auth }) => {
    const { id, force } = args;
    const { id: userId } = auth;
    const { CategoryModel } = models;
    const category = await CategoryModel.findOne({
      where: {
        userId,
        id,
      },
    });
    const hasChildren = await CategoryModel.findAll({
      where: { parentId: id },
    });
  },
});

module.exports = {
  CategoryType,
  CategoryPaginationType,
  query: {
    ownCategories,
  },
  mutation: {
    createCategory,
  },
};
