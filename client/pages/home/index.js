import React from 'react';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { withApollo } from 'react-apollo';
import { Classes, Overlay, Button, Intent, Spinner } from '@blueprintjs/core';
import SideMenu from '@/components/SideMenu';
import styles from './index.css';

const INITIAL_DATA = gql`
  query InitData($entriesOffset: Int! = 0, $entriesLimit: Int! = 20) {
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
    ownSubscriptionEntryList(offset: $entriesOffset, limit: $entriesLimit) {
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

class Home extends React.Component {
  static async getInitialProps({ apolloClient }) {
    try {
      const props = await apolloClient.query({
        query: INITIAL_DATA,
      });
      return props;
    } catch {
      return {};
    }
  }

  state = {
    data: null,
    loading: false,
    error: null,
  };

  handleReceiveMessage = async e => {
    if (!e.data || e.data.type !== 'SIGN_IN') return;

    const { client } = this.props;
    await client.cache.reset();
    this.setState({ loading: true });
    const { error, data } = await client.query({
      query: INITIAL_DATA,
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
    const data = this.state.data ? this.state.data : this.props.data;
    const { profile, ownSubscriptionList } = data || {};
    const { loading, error } = this.state;
    if (loading)
      return (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      );
    return (
      <div className={classNames(styles.homeWrap)}>
        <section className={styles.navWrap}>
          <SideMenu
            subscriptionList={ownSubscriptionList ? ownSubscriptionList.rows : []}
            isLogined={!profile}
            username={profile && profile.username}
            avatar={profile && profile.avatar}
          />
        </section>
        <main className={Classes.FILL}>{profile && profile.username}</main>
      </div>
    );
  }
}

export default withApollo(Home);
