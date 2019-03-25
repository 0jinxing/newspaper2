const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || '172601673@qq.com';

module.exports = target => {
  const { resolve } = target;
  return Object.assign({}, target, {
    resolve: (root, args, context) => {
      const { ctx } = context;
      const token = /Bearer\s+(.*)/.exec(ctx.headers['authorization'])[1];
      // @TODO error handle
      ctx.auth = jwt.verify(token, secret);
      return resolve(root, args, context);
    },
  });
};
