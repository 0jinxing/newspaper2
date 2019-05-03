const {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} = require('graphql');
const jwt = require('jsonwebtoken');
const { passwordHash, passwordVerify, withAuth } = require('../utils/auth');

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpires = parseInt(process.env.JWT_ACCESS_EXPIRES, 10);
const refreshExpires = parseInt(process.env.JWT_REFRESH_EXPIRES, 10);

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

const SignInPayload = new GraphQLObjectType({
  name: 'SignInPayload',
  fields: {
    user: {
      type: UserType,
    },
    accessToken: {
      type: GraphQLString,
    },
    accessExpires: {
      type: GraphQLInt,
    },
    refreshToken: {
      type: GraphQLString,
    },
    refreshExpires: {
      type: GraphQLInt,
    },
  },
});

// query
const profile = withAuth({
  type: UserType,
  resolve: async (root, args, { ctx, models, auth }) => {
    const { UserModel } = models;
    return await UserModel.findOne({ where: { id: auth.id } });
  },
});

// mutation
const modifyProfile = withAuth({
  type: UserType,
  args: {
    avatar: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
    wechat: {
      type: GraphQLString,
    },
    github: {
      type: GraphQLString,
    },
  },
  resolve: async (root, args, { auth, ctx, db, models }) => {
    const { avatar, username, wechat, github } = args;
    const { UserModel } = models;
    const currentUser = await UserModel.findOne({ where: { id: auth.id } });
    currentUser.username = username ? username : currentUser.username;
    currentUser.avatar = avatar ? avatar : currentUser.avatar;
    currentUser.wechat = wechat ? wechat : currentUser.wechat;
    currentUser.github = github ? github : currentUser.github;
    await currentUser.save();
    return currentUser;
  },
});

const signUpUser = {
  type: SignInPayload,
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
  resolve: async (root, args, { ctx, models }) => {
    const { email, username, password } = args;
    const sale = Math.random()
      .toString(36)
      .slice(2);
    const { UserModel } = models;
    const user = await UserModel.create({
      email,
      username,
      password: passwordHash(password, sale),
      sale,
    });

    const accessToken = jwt.sign({ id: user.id }, accessSecret, { expiresIn: accessExpires });
    const refreshToken = jwt.sign({ id: user.id, accessToken }, refreshSecret, {
      expiresIn: refreshExpires,
    });
    ctx.cookies.set('access_token', accessToken, {
      maxAge: accessExpires,
      httpOnly: false,
    });
    ctx.cookies.set('refresh_token', refreshToken, {
      maxAge: refreshExpires,
      httpOnly: false,
    });
    return { user, accessToken, accessExpires, refreshToken, refreshExpires };
  },
};

const signInUser = {
  type: SignInPayload,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (root, args, { ctx, models }) => {
    const { email, password } = args;
    const { UserModel } = models;
    const user = await UserModel.findOne({ where: { email } });
    if (user && passwordVerify(password, user.password, user.sale)) {
      const accessToken = jwt.sign({ id: user.id }, accessSecret, { expiresIn: accessExpires });
      const refreshToken = jwt.sign({ id: user.id, accessToken }, refreshSecret, {
        expiresIn: refreshExpires,
      });
      ctx.cookies.set('access_token', accessToken, {
        maxAge: accessExpires,
        httpOnly: false,
      });
      ctx.cookies.set('refresh_token', refreshToken, {
        maxAge: refreshExpires,
        httpOnly: false,
      });
      return {
        user,
        accessToken,
        accessExpires,
        refreshToken,
        refreshExpires,
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
    const existUser = await UserModel.findOne({ where: { email } });
    return !existUser;
  },
};

module.exports = {
  UserType,
  SignInPayload,
  query: { profile },
  mutation: {
    signUpUser,
    signInUser,
    modifyProfile,
    checkEmail,
  },
};
