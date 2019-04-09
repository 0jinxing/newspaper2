import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Mutation, Query } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card, Menu } from 'antd';
import gql from 'graphql-tag';
import { setAccessToken, setRefreshToken } from '../utils/auth';

const OWN_SUBSCRIPTION_LIST = gql`
  query OwnSubscriptionList($offset: Int, limit: Int){
    ownSubscriptionList(offset: $offset, limit: $limit) {
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
  }
`;

class SiderBar extends Component {
  render() {
    return (
      <Query query={OWN_SUBSCRIPTION_LIST}>
        {({ data }) => {
          return (
            <Sider breakpoint="lg" width="260px" style={{ background: '#FFF' }} collapsedWidth={0}>
              <Menu
                className="sider-menu"
                theme="light"
                mode="inline"
                defaultSelectedKeys={['start']}
              >
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
          );
        }}
      </Query>
    );
  }
}
