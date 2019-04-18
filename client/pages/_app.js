// import fetch from 'isomorphic-fetch';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import withRedux from 'next-redux-wrapper';

import { getAccessToken, getRefreshToken } from '../utils/auth';
import configureStore from '../configure-store';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    fetch: (...params) => {
      const [url, options] = params;
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
    },
    credentials: 'same-origin',
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
