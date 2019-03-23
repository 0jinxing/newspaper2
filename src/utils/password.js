import crypto from 'crypto';

export function getHash(password, sale = '') {
  const sha1 = crypto.createHash('sha1');
  sha1.update(`${password}${sale}`);
  return sha1.digest('hex');
}

export function doVerify(password, sha1, sale = '') {
  return hash(password, sale) === sha1;
}
