const xml2js = require('xml2js');
const fetch = require('isomorphic-fetch');

const DEFAULT_HEADERS = {
  Accept: 'application/rss+xml',
};

const parserRSS = async url => {
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  const xmlStr = await res.text();

  
};
