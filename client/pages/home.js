import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card, Menu } from 'antd';
import gql from 'graphql-tag';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import SiderBarMenu from '../components/SiderBarMenu';
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
      // ant-layout-has-sider 解决 ssr 效果延迟
      <Layout className="home-wrap ant-layout-has-sider">
        <SiderBarMenu />
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
