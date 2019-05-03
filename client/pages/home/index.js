import React from 'react';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { withApollo } from 'react-apollo';
import { Classes, Overlay, Button, Intent, Spinner } from '@blueprintjs/core';
import SideMenu from '@/components/SideMenu';
import styles from './index.css';

const INITIAL_DATA = gql`
  query InitData {
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

class Home extends React.Component {
  static async getInitialProps({ apolloClient }) {
    const props = await apolloClient.query({
      query: INITIAL_DATA,
    });
    return props;
  }

  state = {
    data: {},
    loading: false,
  };

  handleReceiveMessage = async e => {
    if (!e.data || e.data.type !== 'SIGN_IN') return;
    const { client } = this.props;
    const result = await client.query({
      query: INITIAL_DATA,
    });
    
  };

  componentDidMount() {
    window.addEventListener('message', this.handleReceiveMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage, false);
  }

  render() {
    const { loading, subscriptionList = [], username, avatar } = this.state || {};
    if (loading)
      return (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      );
    return (
      <div className={classNames(styles.homeWrap)}>
        <section className={styles.navWrap}>
          <SideMenu subscriptionList={subscriptionList} username={username} avatar={avatar} />
        </section>
        <main className={Classes.FILL}>lorem</main>
      </div>
    );
  }
}

export default withApollo(Home);
