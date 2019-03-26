const { GraphQLID, GraphQLString, GraphQLObjectType } = require('graphql');
const DateType = require('./date.scalar');
const { FeedType } = require('./feed.schema');

const EntryType = new GraphQLObjectType({
  name: 'Entry',
  fields: {
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    link: {
      type: GraphQLString,
    },
    updated: {
      type: DateType,
    },
    content: {
      type: GraphQLString,
    },
    source: FeedType,
  },
});

module.exports = {
  EntryType,
};
