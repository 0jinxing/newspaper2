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
        <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }} />
        <Layout className="content-layout">
          <Content className="content" style={{ marginTop: 88 }}>
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
