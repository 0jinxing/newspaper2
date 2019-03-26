const glob = require('glob');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const fields = glob.sync('server/graphql/*.schema.js', { nodir: true, realpath: true }).reduce(
  (pre, s) => {
    const schema = require(s);
    return {
      query: { ...pre.query, ...schema.query },
      mutation: { ...pre.mutation, ...schema.mutation },
    };
  },
  { query: {}, mutation: {} }
);

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: fields.query
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: fields.mutation
  }),
});
