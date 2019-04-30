import React from 'react';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { Classes, Overlay, Button, Intent, Spinner } from '@blueprintjs/core';
import SideMenu from '@/components/SideMenu';
import { setAccessToken, setRefreshToken, getAccessToken } from '@/utils/auth';
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

  static async getInitialProps() {
    throw "";
    // const homeResponse = await fetch(someapi2);
    // return { homeData: homeResponse };
  }

  handleReceiveMessage = async e => {
    if (!e.data || e.data.type !== 'SIGN_IN') return;
    const {
      data: {
        accessToken,
        refreshToken,
        user: { username, avatar },
      },
    } = e;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
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
  // async componentDidMount() {
  //   const { client } = this.props;
  //   if (getAccessToken()) {
  //     this.setState({ loading: true });
  //     const {
  //       data: {
  //         profile: { username, avatar },
  //         ownSubscriptionList: { rows: subscriptionList },
  //       },
  //     } = await client.query({ query: INIT_DATA });
  //     this.setState({ username, avatar, subscriptionList, loading: false });
  //   }
  // }

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
