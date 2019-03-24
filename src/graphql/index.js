const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const { signinUser, registerUser, profile } = require('./user');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      profile,
      demo: {
        type: GraphQLString,
        resolve: () => 'demo',
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      signinUser,
      registerUser,
    },
  }),
});
