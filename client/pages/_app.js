import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import withRedux from 'next-redux-wrapper';

import configureStore from '@/utils/configure-store';
import withApollo from '@/utils/with-apollo';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';

class $App extends App {
  render() {
    const { Component, pageProps, store, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider store={store} client={apolloClient}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(withRedux(configureStore)($App));
