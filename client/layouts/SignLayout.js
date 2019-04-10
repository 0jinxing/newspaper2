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
          <Card className="card">
            <div className="card-header">
              <img src="/static/backpack.png" />
              <h1>{title}</h1>
            </div>
            {children}
          </Card>
        </Content>
        <Footer className="footer">
          <Copyright />
        </Footer>
      </Layout>
    );
  }
}
