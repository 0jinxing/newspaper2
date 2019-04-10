import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card, Menu } from 'antd';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import SiderMenuLoader from "./SiderMenuLoader";
import './SiderMenu.less';

const { Item: MenuItem, SubMenu } = Menu;
const { Sider } = Layout;

const OWN_SUBSCRIPTION_LIST = gql`
  query OwnSubscriptionList($offset: Int, $limit: Int) {
    ownSubscriptionList(offset: $offset, limit: $limit) {
      count
      rows {
        id
        userId
        link
        favicon
        title
        date
      }
    }
  }
`;

export default class SiderMenu extends Component {
  render() {
    return (
      <Query query={OWN_SUBSCRIPTION_LIST}>
        {({ data, loading }) => {
          const {
            ownSubscriptionList: { count, rows },
          } = loading ? { ownSubscriptionList: {} } : data;

          return (
            <Sider className="sider-menu-wrap">
              {loading ? (
                <SiderMenuLoader/>
              ) : (
                <Menu
                  className="sider-menu"
                  theme="light"
                  mode="inline"
                  defaultOpenKeys={['start']}
                  defaultSelectedKeys={['today']}
                >
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
                    {rows.map(r => (
                      <MenuItem key={r.link}>
                        {/* @TODO title 长度限制 */}
                        <span className="sider-site-menu"> {r.title}</span>
                      </MenuItem>
                    ))}
                  </SubMenu>
                </Menu>
              )}
            </Sider>
          );
        }}
      </Query>
    );
  }
}
