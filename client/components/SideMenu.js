import React from 'react';
import gql from 'graphql-tag';
import classNames from 'classnames';
import Router from 'next/router';
import { Icon, Classes, Tree } from '@blueprintjs/core';
import { withApollo } from 'react-apollo';
import openWindow from '@/utils/open-window';
import SideDivider from './SideDivider';
import styles from './SideMenu.css';

const GET_ENTRIES_BY_SITE = gql`
  query EntryListOfSite($siteId: ID!, $offset: Int, $limit: Int) {
    entryListOfSite(siteId: $siteId, offset: $offset, limit: $limit) {
      rows {
        id
        title
      }
      count
    }
  }
`;

const transformSiteTreeData = data => {
  return data.map(item => ({
    hasCaret: true,
    label: item.title,
    id: item.id,
    icon: 'globe-network',
  }));
};

const transformEntryTreeData = data => {
  return data.map(item => ({
    label: item.title,
    id: item.id,
    icon: 'paperclip',
  }));
};

class SideMenu extends React.Component {
  componentWillMount() {
    const { subscriptionList } = this.props;
    this.setState({ nodes: transformSiteTreeData(subscriptionList) });
  }

  handleLogin = () => {
    if (!this.loginWindow || this.loginWindow.closed) {
      this.loginWindow = openWindow('/user/auth/login', 600, 800);
    }
    this.loginWindow.focus();
  };

  handleNodeExpand = async node => {
    const { client } = this.props;
    node.isExpanded = true;
    if (!node.childNodes) {
      node.secondaryLabel = '...';
      this.setState(this.state);
      const {
        data: {
          entryListOfSite: { rows },
        },
      } = await client.query({
        query: GET_ENTRIES_BY_SITE,
        variables: { siteId: node.id },
      });
      node.childNodes = transformEntryTreeData(rows);
      node.secondaryLabel = '';
    }
    this.setState(this.state);
  };

  handleNodeCollapse = node => {
    node.isExpanded = false;
    this.setState(this.state);
  };

  handleNodeCliek = node => {
    if (node.hasCaret) return;
    Router.push(`/post/${node.id}`);
  };

  render() {
    const { username, avatar } = this.props;
    const { nodes } = this.state;

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
        <Tree
          onNodeClick={this.handleNodeCliek}
          onNodeCollapse={this.handleNodeCollapse}
          onNodeExpand={this.handleNodeExpand}
          contents={nodes}
        />
        <div className={classNames(styles.sideCopyright, Classes.TEXT_MUTED)}>
          © 2019 JINXING LIN
        </div>
      </nav>
    );
  }
}

export default withApollo(SideMenu);
