const xmljs = require('xml-js');
const fetch = require('isomorphic-fetch');

const DEFAULT_HEADERS = {
  Accept: 'application/rss+xml',
};

const parserRSS = async url => {
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  const xmlText = await res.text();
  const xmlObject = xmljs.xml2js(xmlText);
  
};
parserRSS('http://zhangwenli.com/blog/feed.xml');
