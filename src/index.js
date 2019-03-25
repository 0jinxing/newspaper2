const Koa = require('koa');
const next = require("next");
const { ApolloServer } = require('apollo-server-koa');
const schema = require('./graphql');
const models = require('./sequelize');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  // graphql server setting
  const buildContext = async ({ ctx }) => {
    return { ctx, models };
  };
  const graphqlServer = new ApolloServer({
    schema,
    context: buildContext,
  });
  graphqlServer.applyMiddleware({ app: server });

  // next app setting
  server.use(async (ctx, next) => {
    if (ctx.request.method.toUpperCase() === "GET") {
      await handle(ctx.req, ctx.res)
      ctx.respond = false
    } else {
      await next();
    }
  })

  server.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${graphqlServer.graphqlPath}`)
  );
});
