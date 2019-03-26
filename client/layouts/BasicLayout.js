import { Col, Row, Layout } from 'antd';
import Copyright from '../components/Copyright';

const { Content, Footer } = Layout;

export default ({ children }) => {
  return (
    <Layout>
      <Content>{children}</Content>
      <Footer>
        <Copyright />
      </Footer>
    </Layout>
  );
};
