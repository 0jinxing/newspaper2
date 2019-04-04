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
  },
  resolve: async (root, args, { models, auth }) => {},
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
