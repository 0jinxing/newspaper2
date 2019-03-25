import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// const client = 

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ApolloProvider>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}