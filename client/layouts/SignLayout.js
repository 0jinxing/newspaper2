import { Component } from 'react';
import { Layout, Card } from 'antd';
import Copyright from '../components/Copyright';
import './SignLayout.less';

const { Content, Footer } = Layout;

export default class SignLayout extends Component {
  render() {
    const { children, title } = this.props;
    return (
      <Layout className="sign-layout-wrap">
        <Content>
          <Card className="sign-layout-card">
            <div className="sign-layout-card-header">
              <img src="/static/backpack.png" />
              <h1>{title}</h1>
            </div>
            {children}
          </Card>
        </Content>
        <Footer className="sign-layout-footer">
          <Copyright />
        </Footer>
      </Layout>
    );
  }
}
