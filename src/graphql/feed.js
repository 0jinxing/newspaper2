import { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType } from 'graphql';
import DateType from './date.scalar';

export const FeedType = new GraphQLObjectType({
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
