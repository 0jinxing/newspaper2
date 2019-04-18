// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="referrer" content="no-referrer" />
          <link rel="stylesheet" href="/static/normalize.css/normalize.css" />
          <link rel="stylesheet" href="/static/@blueprintjs/core/lib/css/blueprint.css" />
          <link rel="stylesheet" href="/static/@blueprintjs/icons/lib/css/blueprint-icons.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
