import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card, Menu } from 'antd';
import gql from 'graphql-tag';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import '../styles/home.less';

const { Header, Content, Footer, Sider } = Layout;

const QUERY_SUBSCRIPTION_INFO = gql`
  query QuerySubscriptionInfo(
    $siteOffset: Int
    $siteLimit: Int
    $entryOffset: Int
    $entryLimit: Int
  ) {
    ownSubscriptionList(siteOffset: $offset, limit: $siteLimit) {
      count
      rows {
        id
        userId
        link
        favicon
        title
        updated
      }
    }
    ownSubscriptionEntryList(offset: $entryOffset, limit: $entryLimit) {
      count
      rows {
        id
        siteId
        title
        link
        updated
        snippet
      }
    }
  }
`;

class HomePage extends Component {
  render() {
    return (
      <Layout className="home-wrap ant-layout-has-sider">
        <Sider breakpoint="lg" width="260px" style={{ background: '#FFF' }} collapsedWidth={0}>
          <Menu className="sider-menu" theme="light" mode="inline" defaultSelectedKeys={['start']}>
            <Menu.Item key="today">
              <Icon type="calendar" />
              <span className="nav-text">TODAY</span>
            </Menu.Item>
            <Menu.Item key="all">
              <Icon type="tag" />
              <span className="nav-text">ALL</span>
            </Menu.Item>
            <Menu.Item key="start">
              <Icon type="star" />
              <span className="nav-text">START</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>content</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>2NEWSPAPER ©2019 Created by Jinxing Lin</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default HomePage;
