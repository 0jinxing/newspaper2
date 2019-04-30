import fetch from 'isomorphic-fetch';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import withRedux from 'next-redux-wrapper';

import { getAccessToken, getRefreshToken } from '../utils/auth';
import configureStore from '../utils/configure-store';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';

const wrapFetch = async (...params) => {
  const [url, options] = params;
  try {
    const accessToken = getAccessToken();
    const res = await fetch(url, {
      ...options,
      headers: accessToken
        ? {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          }
        : options.headers,
    });
    return res;
  } catch (error) {
    if (error.message === 'ERR_INCORRECT_AUTH') {
      // @TODO refresh token
    }
  }
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
    fetch: wrapFetch,
  }),
  cache: new InMemoryCache(),
});

class MyApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(configureStore)(MyApp);
