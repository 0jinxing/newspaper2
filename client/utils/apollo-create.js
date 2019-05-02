import React from 'react';
import { ApolloConsumer } from 'react-apollo';

const apolloCreate = Component => {
  return props => {
    return <ApolloConsumer>{client => <Component {...props} client={client} />}</ApolloConsumer>;
  };
};

export default apolloCreate;
