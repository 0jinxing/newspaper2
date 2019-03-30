const { GraphQLList, GraphQLInt, GraphQLObjectType } = require('graphql');

module.exports = (type, name) => {
  return new GraphQLObjectType({
    name,
    fields: {
      rows: {
        type: new GraphQLList(type),
      },
      count: {
        type: GraphQLInt,
      },
    },
  });
};
