import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { login, register, profile } from './user';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      profile,
      demo: {
        type: GraphQLString,
        resolve: () => "demo"
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      login,
      register
    }
  })
})