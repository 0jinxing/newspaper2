import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card, Menu } from 'antd';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import './styles/sider-bar-menu.less';

const { Item: MenuItem, SubMenu } = Menu;

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

export default class SiderBarMenu extends Component {
  render() {
    return (
      <Query query={OWN_SUBSCRIPTION_LIST}>
        {({ data }) => {
          return (
            <Sider breakpoint="lg" width="260px" style={{ background: '#FFF' }}>
              <Menu theme="light" mode="inline" defaultSelectedKeys={['start']}>
                <Menu.Item key="today">
                  <Icon type="calendar" />
                  <span>TODAY</span>
                </Menu.Item>
                <Menu.Item key="all">
                  <Icon type="tag" />
                  <span>ALL</span>
                </Menu.Item>
                <SubMenu
                  key="start"
                  title={
                    <span>
                      <Icon type="star" />
                      <span>START</span>
                    </span>
                  }
                >
                  {data.rows.map(r => (
                    <MenuItem key={r.link}>
                      {/* @TODO title 长度限制 */}
                      <span className="sider-bar-site-menu"> {r.title}</span>
                    </MenuItem>
                  ))}
                </SubMenu>
              </Menu>
            </Sider>
          );
        }}
      </Query>
    );
  }
}
