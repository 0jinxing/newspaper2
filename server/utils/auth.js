const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const passwordHash = (password, sale = '') => {
  const sha1 = crypto.createHash('sha1');
  sha1.update(`${password}${sale}`);
  return sha1.digest('hex');
};

const passwordVerify = (password, sha1, sale = '') => passwordHash(password, sale) === sha1;

// jwt config
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpires = process.env.JWT_ACCESS_EXPIRES; // 30 m
const refreshExpires = process.env.JWT_REFRESH_EXPIRES; // 30 d

const signAccessToken = payload => {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpires });
};

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
        const accessToken = /Bearer\s+(.*)/.exec(ctx.headers['authorization'])[1];
        return target.resolve(root, args, {
          ...context,
          auth: jwt.verify(accessToken, accessSecret),
        });
      } catch (error) {
        // @TODO Refresh Token
        console.log(error);
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
