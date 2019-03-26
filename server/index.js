const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const schema = require('./graphql');
const models = require('./sequelize');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const server = new Koa();
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: './client' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // graphql server setting
  const buildContext = async ({ ctx }) => {
    return { ctx, models };
  };
  const graphqlServer = new ApolloServer({
    schema,
    context: buildContext,
  });
  graphqlServer.applyMiddleware({ app: server, path: '/graphql' });

  // next router app setting
  // server.use(router.routes());
  server.use(async (ctx, next) => {
    if (ctx.request.method.toUpperCase() === 'GET') {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    } else {
      await next();
    }
  });

  server.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${graphqlServer.graphqlPath}`)
  );
});
