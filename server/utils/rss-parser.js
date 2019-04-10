const xmlParser = require('xml2js');
const fetch = require('isomorphic-fetch');

const DEFAULT_HEADERS = {
  Accept: 'application/rss+xml',
};

// promise 风格
function xml2js(xmlText) {
  return new Promise((resolve, reject) => {
    xmlParser.parseString(xmlText, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function buildAtomFeed(xmlObj) {}

function buildRSS0_9(xmlObj) {}

function buildRSS1(xmlObj) {}

function buildRSS2(xmlObj) {}

function buildRSS(xmlObj) {
  let feed = { items: [] };
  if (xmlObj.feed.link) {
    feed.link = getFeedLink(xmlObj.feed.link, 'alternate', 0);
    feed.feedUrl = getFeedLink(xmlObj.feed.link, 'self', 1);
  }
  if (xmlObj.feed.title) {
    let title = xmlObj.feed.title[0] || '';
    if (title._) title = title._;
    if (title) feed.title = title;
  }
  if (xmlObj.feed.updated) {
    feed.lastBuildDate = xmlObj.feed.updated[0];
  }
  (xmlObj.feed.entry || []).forEach(entry => {
    let item = {};
    if (entry.title) {
      let title = entry.title[0] || '';
      if (title._) title = title._;
      if (title) item.title = title;
    }
    if (entry.link && entry.link.length) {
      item.link = getFeedLink(entry.link, 'alternate', 0);
    }
    if (entry.published && entry.published.length && entry.published[0].length)
      item.pubDate = new Date(entry.published[0]).toISOString();
    if (!item.pubDate && entry.updated && entry.updated.length && entry.updated[0].length)
      item.pubDate = new Date(entry.updated[0]).toISOString();
    if (entry.author && entry.author.length) item.author = entry.author[0].name[0];
    if (entry.content && entry.content.length) {
      item.content = utils.getContent(entry.content[0]);
      item.contentSnippet = utils.getSnippet(item.content);
    }
    if (entry.id) {
      item.id = entry.id[0];
    }
    this.setISODate(item);
    feed.items.push(item);
  });
  return feed;
}

function getFeedLink(links, rel, fallbackIdx) {
  if (!links) return;
  for (let i = 0; i < links.length; ++i) {
    if (links[i].$.rel === rel) return links[i].$.href;
  }
  if (links[fallbackIdx]) return links[fallbackIdx].$.href;
}

function getFeedContent(content) {
  if (typeof content._ === 'string') {
    return content._;
  } else if (typeof content === 'object') {
    let builder = new xmlParser.Builder({
      headless: true,
      explicitRoot: true,
      rootName: 'div',
      renderOpts: { pretty: false },
    });
    return builder.buildObject(content);
  } else {
    return content;
  }
}

function getFeedSnippet(str) {
  // @TODO 优化
  return str;
}

async function parserURL(url) {
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  const xmlText = await res.text();
  const xmlObj = await xml2js(xmlText);

  let feed = null;
  if (xmlObj.feed) {
    feed = buildAtomFeed(xmlObj);
  } else if (
    xmlObj.rss &&
    xmlObj.rss.$ &&
    xmlObj.rss.$.version &&
    xmlObj.rss.$.version.match(/^2/)
  ) {
    feed = buildRSS2(xmlObj);
  } else if (xmlObj['rdf:RDF']) {
    feed = buildRSS1(xmlObj);
  } else if (xmlObj.rss && xmlObj.rss.$ && xmlObj.rss.$.version) {
    if (xmlObj.rss.$.version.match(/0\.9/)) feed = buildRSS0_9(xmlObj);
    else if (xmlObj.rss.$.version.match(/1\.0/)) feed = buildRSS1(xmlObj);
    else if (xmlObj.rss.$.version.match(/2\.0/)) feed = buildRSS2(xmlObj);
  } else if (xmlObj.rss) {
    feed = buildRSS2(xmlObj);
  } else {
    return reject(new Error('Feed not recognized as RSS 1 or 2.'));
  }
}
parserURL('https://blog.gh-0.xyz/atom.xml');
// parserURL('http://zhangwenli.com/blog/feed.xml');
