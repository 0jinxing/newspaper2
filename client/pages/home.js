import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card, Menu } from 'antd';
import gql from 'graphql-tag';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import HomeLayout from '../layouts/HomeLayout';
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
      <HomeLayout>content</HomeLayout>
    );
  }
}

export default HomePage;
