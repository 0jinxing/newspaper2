import { Component } from 'react';
import { Layout, Card } from 'antd';
import SiderMenu from '../components/SiderMenu';
import Copyright from '../components/Copyright';
import './HomeLayout.less';

const { Header, Content, Footer } = Layout;

export default class HomeLayout extends Component {
  render() {
    const { children } = this.props;
    return (
      <Layout className="home-layout-wrap ant-layout-has-sider">
        <SiderMenu />
        <Layout className="content-layout">
          <Header className="header" />
          <Content className="content">
            <div className="content-wrap">{children}</div>
          </Content>
          <Footer className="footer">
            <Copyright />
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
