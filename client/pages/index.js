import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import EntryItem from '@/components/EntryItem';
import IndexLayout from '@/layouts/IndexLayout';

const SIDE_DATA = gql`
  query SideData {
    profile {
      username
      avatar
    }
    ownSubscriptionList {
      rows {
        title
        id
      }
    }
  }
`;

const ALL_ENTRIES = gql`
  query AllEntries($offset: Int, $limit: Int) {
    allEntries(offset: $offset, limit: $limit) {
      rows {
        id
        title
        summary
        date
        link
      }
      count
    }
  }
`;

class Index extends React.Component {
  static async getInitialProps({ apolloClient }) {
    let entriesProps = {};
    let authProps = {};
    try {
      entriesProps = await apolloClient.query({
        query: ALL_ENTRIES,
      });
      authProps = await apolloClient.query({
        query: SIDE_DATA,
      });
      const props = {
        data: {
          ...(entriesProps.data || {}),
          ...(authProps.data || {}),
        },
        error: entriesProps.error || authProps.error,
        loading: entriesProps.loading || authProps.loading,
      };
      return props;
    } catch (e) {
      const props = {
        data: {
          ...(entriesProps.data || {}),
          ...(authProps.data || {}),
        },
        error: entriesProps.error || authProps.error,
        loading: entriesProps.loading || authProps.loading,
      };
      return props;
    }
  }

  state = {
    error: null,
    data: null,
    loading: false,
  };

  handleReceiveMessage = async e => {
    if (!e.data || e.data.type !== 'SIGN_IN') return;

    const { client } = this.props;
    this.setState({ loading: true });
    const { error, data } = await client.query({
      query: ALL_ENTRIES,
    });
    this.setState({ loading: false, error, data });
  };

  componentDidMount() {
    window.addEventListener('message', this.handleReceiveMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage, false);
  }

  render() {
    const data = this.state.data || this.props.data || {};
    const allEntries = data.allEntries || { rows: [], count: 0 };
    return (
      <IndexLayout {...this.props} loading={this.props.loading || this.state.loading}>
        {allEntries.rows.map(r => (
          <EntryItem {...r} key={r.id} />
        ))}
      </IndexLayout>
    );
  }
}

export default withApollo(Index);
