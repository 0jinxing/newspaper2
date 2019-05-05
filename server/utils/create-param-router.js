const Router = require('koa-router');
const glob = require('glob');

const pagesRootPath = 'client/pages';

module.exports = app => {
  const router = new Router();
  // $ 参数路由
  return glob
    .sync(`${pagesRootPath}/**/$*.js`)
    .map(full => full.replace(pagesRootPath, ''))
    .map(pp => /((?:\/[0-9A-Za-z]+)*)\/\$([0-9A-Za-z]+)/g.exec(pp))
    .reduce((router, [page, path, paramName]) => {
      router.get(`${path}/:${paramName}`, ctx => {
        const { req, res, params } = ctx;
        app.render(req, res, page, params);
      });
      return router;
    }, router);
};
