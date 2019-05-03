import React from 'react';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { Icon, Classes, Tree } from '@blueprintjs/core';
import { withApollo } from 'react-apollo';
import openWindow from '@/utils/open-window';
import SideDivider from './SideDivider';
import styles from './SideMenu.css';

const SIDE_MENU_DATA = gql`
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

const transformTreeData = data => {
  return data.map(item => ({
    hasCaret: true,
    label: item.title,
    id: item.id,
  }));
};

class SideMenu extends React.Component {
  handleLogin = () => {
    if (!this.loginWindow || this.loginWindow.closed) {
      this.loginWindow = openWindow('/user/auth/login', 600, 800);
    }
    this.loginWindow.focus();
  };

  render() {
    const { username, avatar, subscriptionList } = this.props;
    return (
      <nav className={styles.sideMenu}>
        <div className={classNames(styles.sideHead)}>
          <img src="/static/favicon.png" className={styles.sideLogo} />
          <div>
            <p className={styles.sideTitle}>2NEWSPAPER</p>
            <a>View on GitHub</a>
          </div>
        </div>
        <SideDivider />
        <div className={classNames(styles.menuItem, Classes.MENU_ITEM)}>
          <Icon icon="calendar" /> <span className={Classes.TEXT_MUTED}>Today</span>
        </div>
        <SideDivider />
        <div className={classNames(styles.menuItem, Classes.MENU_ITEM)}>
          <Icon icon="search" /> <span className={Classes.TEXT_MUTED}>Search</span>
        </div>
        <SideDivider />
        {username ? null : (
          <>
            <div
              className={classNames(styles.menuItem, Classes.MENU_ITEM)}
              onClick={this.handleLogin}
            >
              <Icon icon="log-in" /> <span className={Classes.TEXT_MUTED}>Log in</span>
            </div>
            <SideDivider />
          </>
        )}
        <Tree contents={transformTreeData(subscriptionList)} />
        <div className={classNames(styles.sideCopyright, Classes.TEXT_MUTED)}>
          © 2019 JINXING LIN
        </div>
      </nav>
    );
  }
}

export default SideMenu;
