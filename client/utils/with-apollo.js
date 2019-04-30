import Head from 'next/head';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import initApollo from './init-apollo';

const getComponentDisplayName = Component => {
  return Component.displayName || Component.name || 'Unknown';
};

export default ComposedComponent => {
  return class WithData extends React.Component {
    static displayName = `WithData(${getComponentDisplayName(ComposedComponent)})`;

    static async getInitialProps(ctx) {
      let serverState = { apollo: { data: {} } };
      let composedInitialProps = {};

      if (typeof ComposedComponent.getInitialProps === 'function') {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx);
      }

      if (!process.browser) {
        const apolloClient = initApollo();
        try {
          await getDataFromTree(
            <ApolloProvider client={apolloClient}>
              <ComposedComponent {...composedInitialProps} />
            </ApolloProvider>,
            {
              router: {
                asPath: ctx.asPath,
                pathname: ctx.pathname,
                query: ctx.query,
              },
            }
          );
        } catch (error) {}
        Head.rewind();
        serverState = {
          apollo: {
            data: apolloClient.cache.extract(),
          },
        };
      }
      return {
        serverState,
        ...composedInitialProps,
      };
    }
    constructor(props) {
      super(props);
      this.apollo = initApollo(this.props.serverState.apollo.data);
    }
    render() {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
};
