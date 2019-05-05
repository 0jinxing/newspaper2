import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Spinner, Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import SideMenu from '@/components/SideMenu';
import styles from './IndexLayout.css';

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
  }
`;

class IndexLayout extends React.Component {
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
    const { children } = this.props;
    const data = this.state.data || this.props.data;
    const profile = data.profile || {};
    const ownSubscriptionList = data.ownSubscriptionList || { rows: [], count: 0 };

    const loading = this.state.loading || this.props.loading;
    const error = this.state.error || this.props.error;

    if (loading)
      return (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      );
    return (
      <div className={classNames(styles.wrap)}>
        <section className={styles.navWrap}>
          <SideMenu
            subscriptionList={ownSubscriptionList.rows}
            isLogined={!!Object.keys(profile).length}
            username={profile.username}
            avatar={profile.avatar}
          />
        </section>
        <main className={classNames(Classes.FILL, styles.container)}>{children}</main>
      </div>
    );
  }
}

export default withApollo(IndexLayout);
