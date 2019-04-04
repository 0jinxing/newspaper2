const url = require('url');
const fetch = require('isomorphic-fetch');

module.exports = async url_str => {
  const { protocol, host } = url.parse(url_str);
  const origin = `${protocol}//${host}`;
  const res = await fetch(origin);
  const html = await res.text();
  const reIco = /<link[^>]+?(?:href\s*=\s*["'](\S*?\.ico)["'])/im;
  const rePng = /<link[^>]+?(?:href\s*=\s*["'](\S*?\.png)["'])/im;
  const reGif = /<link[^>]+?(?:href\s*=\s*["'](\S*?\.gif)["'])/im;

  const icoResult = reIco.exec(html);
  const pngResult = rePng.exec(html);
  const gifResult = reGif.exec(html);
  const to =
    (icoResult && icoResult[1]) || (pngResult && pngResult[1]) || (gifResult && gifResult[1]);
  return (to && url.resolve(origin, to)) || `${origin}/favicon.ico`;
};
