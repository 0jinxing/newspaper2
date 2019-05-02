import React from 'react';
import gql from 'graphql-tag';
import cookie from 'cookie';
import classNames from 'classnames';
import { Classes, Overlay, Button, Intent, Spinner } from '@blueprintjs/core';
import SideMenu from '@/components/SideMenu';
import apolloCreate from '@/utils/apollo-create';
import styles from './index.css';

const INIT_DATA = gql`
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

const OWN_SUBSCRIPTION_LIST = gql`
  query OwnSubscriptionList($offset: Int, $limit: Int) {
    ownSubscriptionList(offset: $offset, limit: $limit) {
      rows {
        title
        id
      }
    }
  }
`;

class Home extends React.Component {
  state = {
    loading: false,
    username: null,
    avatar: null,
    subscriptionList: [],
  };

  handleReceiveMessage = async e => {
    if (!e.data || e.data.type !== 'SIGN_IN') return;
    const {
      data: {
        user: { username, avatar },
      },
    } = e;
    this.setState({
      username,
      avatar,
      loading: true,
    });
    const {
      data: {
        ownSubscriptionList: { rows: subscriptionList },
      },
    } = await this.props.client.query({
      query: OWN_SUBSCRIPTION_LIST,
    });
    this.setState({ subscriptionList, loading: false });
  };

  componentDidMount() {
    window.addEventListener('message', this.handleReceiveMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage, false);
  }

  render() {
    const { loading, subscriptionList, username, avatar } = this.state;
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

export default apolloCreate(Home);
