import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import schema from './graphql';
import models from './sequelize';

+ async function main() {
  const app = new Koa();

  const buildContext = async ({ ctx }) => {
    return { ctx, models };
  };

  const graphqlServer = new ApolloServer({
    schema,
    context: buildContext
  });
  graphqlServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(
      `Server ready at http://localhost:4000${graphqlServer.graphqlPath}`
    )
  );
}();
