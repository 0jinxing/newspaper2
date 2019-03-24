const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const schema = require('./graphql');
const models = require('./sequelize');

+(async function main() {
  const app = new Koa();

  const buildContext = async ({ ctx }) => {
    return { ctx, models };
  };

  const graphqlServer = new ApolloServer({
    schema,
    context: buildContext,
  });
  graphqlServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${graphqlServer.graphqlPath}`)
  );
})();
