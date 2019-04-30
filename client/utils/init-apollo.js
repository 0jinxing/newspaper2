import fetch from 'isomorphic-unfetch';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const authFetch = async (...params) => {
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

let apolloClient = null;

if (!process.browser) {
  global.fetch = fetch;
}

const create = initialState => {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: new HttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

export default initialState => {
  if (!process.browser) {
    return create(initialState);
  }
  if (!apolloClient) {
    apolloClient = create(initialState);
  }
  return apolloClient;
};
