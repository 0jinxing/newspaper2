const crypto = require('crypto');

function getHash(password, sale = '') {
  const sha1 = crypto.createHash('sha1');
  sha1.update(`${password}${sale}`);
  return sha1.digest('hex');
}

function doVerify(password, sha1, sale = '') {
  return getHash(password, sale) === sha1;
}

module.exports = {
  getHash,
  doVerify,
};
