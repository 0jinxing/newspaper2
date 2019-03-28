import { Col, Row, Layout } from 'antd';
import Copyright from '../components/Copyright';
import './BasicLayout.less';

const { Content, Footer, Header } = Layout;

export default ({ children }) => {
  return (
    <Layout className="basic-layout">
      <Layout className="basic-content-layout">
        <Content>{children}</Content>
      </Layout>
      <Footer>
        <Copyright />
      </Footer>
    </Layout>
  );
};
