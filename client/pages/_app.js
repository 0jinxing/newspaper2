// import fetch from 'isomorphic-fetch';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getAccessToken, getRefreshToken } from '../utils/auth';
import '../styles/app.less';

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

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}
