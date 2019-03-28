const {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} = require('graphql');
const jwt = require('jsonwebtoken');

const { passwordHash, passwordVerify, withAuth } = require('../utils/auth');

const secret = process.env.JWT_SECRET || '172601673@qq.com';
const accessExpires = process.env.JWT_ACCESS_EXPIRES || 1000 * 60 * 30; // 30 m
const refreshExpires = process.env.JWT_REFRESH_EXPIRES || 1000 * 60 * 60 * 30; // 30 d

// type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    avatar: {
      type: GraphQLString,
    },
    wechat: {
      type: GraphQLString,
    },
    github: {
      type: GraphQLString,
    },
  },
});

const SigninPayload = new GraphQLObjectType({
  name: 'SigninPayload',
  fields: {
    user: {
      type: UserType,
    },
    accessToken: {
      type: GraphQLString,
    },
    refreshToken: {
      type: GraphQLString,
    },
  },
});

// query
const profile = withAuth({
  type: UserType,
  resolve: async (root, args, { ctx, models }) => {
    const { UserModel } = models;
    const {
      auth: { id },
    } = ctx;
    return await UserModel.findOne({ where: { id } });
  },
});

// mutation
const modifyProfile = withAuth({
  type: UserType,
  args: {
    username: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    wechat: {
      type: GraphQLString,
    },
    github: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { ctx, db }) => {
    const { username, wechat, github, password } = args;
  },
});

const registerUser = {
  type: SigninPayload,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (root, args, { models }) => {
    const { email, username, password } = args;
    const sale = Math.random.toString(36).slice(2);
    const { UserModel } = models;
    const user = await UserModel.create({
      email,
      username,
      password: passwordHash(password, sale),
      sale,
    });

    const accessToken = jwt.sign({ id: user.id }, secret, { expiresIn: accessExpires });
    const refreshToken = jwt.sign({ id: user.id, accessToken }, secret, {
      expiresIn: refreshExpires,
    });
    return { user, accessToken, refreshToken };
  },
};

const signinUser = {
  type: SigninPayload,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (root, args, { models }) => {
    const { email, password } = args;
    const { UserModel } = models;
    const user = await UserModel.findOne({ where: { email } });
    if (user && passwordVerify(password, user.password, user.sale)) {
      const accessToken = jwt.sign({ id: user.id }, secret, { expiresIn: accessExpires });
      const refreshToken = jwt.sign({ id: user.id, accessToken }, secret, {
        expiresIn: refreshExpires,
      });
      return {
        user,
        accessToken,
        refreshToken,
      };
    }
    throw new Error('ERR_INCORRECT_PASSWORD_OR_EMAIL');
  },
};

const checkEmail = {
  type: GraphQLBoolean,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (root, { email }, { models: { UserModel } }) => {
    return !(await UserModel.findOne({ where: { email } }));
  },
};

module.exports = {
  UserType,
  SigninPayload,
  query: { profile },
  mutation: {
    registerUser,
    signinUser,
    modifyProfile,
    checkEmail,
  },
};
