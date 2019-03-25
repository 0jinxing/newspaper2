const { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const DateType = require('./date.scalar');

const FeedType = new GraphQLObjectType({
  name: 'Feed',
  fields: {
    id: {
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
    tags: {
      type: new GraphQLList(GraphQLString),
    },
  },
});

module.exports = {
  FeedType,
};
