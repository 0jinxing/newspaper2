const Koa = require('koa');
const next = require('next');
const { ApolloServer } = require('apollo-server-koa');
const router = require('./routes');
const schema = require('./graphql');
const models = require('./sequelize');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const server = new Koa();
const app = next({ dev });
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
  router.get("/123", async (ctx, next) => {
    await app.render(ctx.req, ctx.res, '/Demo', ctx.query);
    ctx.respond = false;
  })
  server.use(router.routes());
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
