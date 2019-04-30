const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const passwordHash = (password, sale = '') => {
  const sha1 = crypto.createHash('sha1');
  sha1.update(`${password}${sale}`);
  return sha1.digest('hex');
};

const passwordVerify = (password, sha1, sale = '') => passwordHash(password, sale) === sha1;

// jwt config
const accessSecret = process.env.JWT_ACCESS_SECRET || '172601673@qq.com';
const refreshSecret = process.env.JWT_REFRESH_SECRET || '0jinxing@gmail.com';
const accessExpires = process.env.JWT_ACCESS_EXPIRES || 1000 * 60 * 30; // 30 m
const refreshExpires = process.env.JWT_REFRESH_EXPIRES || 1000 * 60 * 60 * 30; // 30 d

const signAccessToken = payload => jwt.sign(payload, accessSecret, { expiresIn: accessExpires });

const signRefreshToken = (payload, accessToken) => {
  return jwt.sign({ ...payload, accessToken }, refreshSecret, { expiresIn: refreshExpires });
};

const verifyAccessToken = token => jwt.verify(token, accessSecret);

const verifyRefreshToken = token => jwt.verify(token, refreshSecret);

const withAuth = target => {
  return Object.assign({}, target, {
    resolve: (root, args, context) => {
      const { ctx } = context;
      try {
        const accessToken =
          /Bearer\s+(.*)/.exec(ctx.headers['authorization'])[1] || ctx.cookies.get('access_token');
        const auth = jwt.verify(accessToken, accessSecret);
        return target.resolve(root, args, { ...context, auth });
      } catch {
        // 更换 token
        const refreshToken = ctx.cookies.get('refresh_token');
        const timeoutAccessToken = ctx.cookies.get('access_token');
        const { id, accessToken } = jwt.verify(refreshToken, refreshSecret);
        if (timeoutAccessToken !== accessToken) {
          throw new Error('ERR_INCORRECT_AUTH');
        }
        const newAccessToken = jwt.sign({ id }, accessSecret, { expiresIn: accessExpires });
        const newRefreshToken = jwt.sign({ id, newAccessToken }, refreshSecret, {
          expiresIn: refreshExpires,
        });
        ctx.cookies.set('access_token', newAccessToken);
        ctx.cookies.set('refresh_token', newRefreshToken);
        return target.resolve(root, args, { ...context, auth });
      }
    },
  });
};

module.exports = {
  passwordHash,
  passwordVerify,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  withAuth,
};
