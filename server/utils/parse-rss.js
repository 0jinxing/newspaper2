const Stream = require('stream');
const FeedParser = require('feedparser');
const moment = require('moment');

class StringStream extends Stream.Readable {
  constructor(str) {
    super();
    this._str = str;
  }
  _read() {
    if (!this.ended) {
      var self = this;
      process.nextTick(function() {
        self.push(Buffer.from(self._str));
        self.push(null);
      });
      this.ended = true;
    }
  }
}

function parseRss(xml) {
  return new Promise((resolve, reject) => {
    try {
      const parser = new FeedParser();
      const stream = new StringStream(xml);
      stream.pipe(parser);
      const items = [];
      parser.on('readable', function() {
        const stream = this;
        let item = null;
        while ((item = stream.read())) {
          items.push(item);
        }
        resolve({ ...this.meta, items });
      });
    } catch (error) {
      reject(error);
    }
  });
}

const fetch = require('isomorphic-fetch');
async function main() {
  const res = await fetch('http://zhangwenli.com/blog/feed.xml');
  const xml = await res.text();
  const data = await parseRss(xml);
  console.log(data);
}

// main();

console.log(+moment(undefined));

module.exports = parseRss;
