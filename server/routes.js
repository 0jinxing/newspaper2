const nextRoutes = require('next-routes');
const glob = require('glob');

const routes = nextRoutes();

const pagesRootPath = 'client/pages/';
module.exports = glob
  .sync(`${pagesRootPath}/**/$*.js`)
  .map(full => full.replace(pagesRootPath, ''))
  .map(pp => /((?:[0-9A-Za-z]+)*)\/\$([0-9A-Za-z]+)/g.exec(pp))
  .reduce((r, [page, path, paramName]) => {
    r.add(page, `/${path}/:${paramName}`);
    return r;
  }, routes);
