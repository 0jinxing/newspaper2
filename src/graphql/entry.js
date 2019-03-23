import { GraphQLID, GraphQLString, GraphQLObjectType } from 'graphql';
import DateType from './date.scalar';
import { FeedType } from './feed';

export const EntryType = new GraphQLObjectType({
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
