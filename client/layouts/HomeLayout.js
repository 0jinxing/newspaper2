import { Component } from 'react';
import { Layout, Card, Icon } from 'antd';
import Media from 'react-media';
import TopHeader from '../components/TopHeader';
import SiderMenu from '../components/SiderMenu';
import Copyright from '../components/Copyright';
import './HomeLayout.less';

const { Header, Content, Footer } = Layout;

class HomeLayout extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { children, isMobile } = this.props;
    const { collapsed } = this.state;
    return (
      <Layout className="home-layout-wrap ant-layout-has-sider">
        <SiderMenu collapsed={collapsed} onCollapse={this.onCollapse} isMobile={isMobile} />
        {/* <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }} /> */}
        <TopHeader className="header" collapsed={collapsed} />
        <Layout className="content-layout">
          <Content className="content" style={{ marginLeft: collapsed ? 96 : 216 }}>
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

export default props => (
  <Media query="(max-width: 599px)">
    {isMobile => <HomeLayout {...props} isMobile={isMobile} />}
  </Media>
);
