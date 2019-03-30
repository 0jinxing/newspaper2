import { Component } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Mutation } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card } from 'antd';
import gql from 'graphql-tag';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import '../styles/sign.less';

const FormItem = Form.Item;
const { Content, Header } = Layout;

const SIGNIN_USER = gql`
  mutation SigninUser($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      user {
        email
        username
        avatar
        github
        wechat
      }
      accessToken
      refreshToken
    }
  }
`;

class LoginPage extends Component {
  static getInitialProps({ query }) {
    return { query };
  }

  render() {
    const {
      form: { getFieldDecorator, validateFields },
    } = this.props;

    return (
      <Mutation
        mutation={SIGNIN_USER}
        onCompleted={data => {
          const {
            signinUser: { accessToken, refreshToken },
          } = data;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          const { redirect_uri } = this.props;
          if (redirect_uri) router.push(redirect_uri);
          else router.push('/');
        }}
      >
        {(signinUser, { data, loading }) => (
          <Layout className="sign-wrap">
            <Header>
              <p className="sentence">承认自己并非你所以为的那种人，称得上是一种相当可怕的经历。</p>
            </Header>
            <Content>
              <Card className="sign-form-card">
                <div className="info-wrap">
                  <img src="/static/backpack.png" />
                  <h1>Sign in to 2Newspaper</h1>
                </div>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    validateFields((error, values) => {
                      if (!error) {
                        const { email, password } = values;
                        signinUser({ variables: { email, password } });
                      }
                    });
                  }}
                >
                  <FormItem>
                    {getFieldDecorator('email', {
                      rules: [
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: '邮箱格式不正确' },
                      ],
                    })(<Input prefix={<Icon type="link" />} placeholder="Email" />)}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your password!' }],
                    })(
                      <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />
                    )}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <a className="sign-form-forgot" href="">
                      Forgot password
                    </a>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      className="sign-form-button"
                    >
                      Sign in
                    </Button>
                    Or{' '}
                    <Link href="/register">
                      <a>register now!</a>
                    </Link>
                  </FormItem>
                </Form>
              </Card>
            </Content>
          </Layout>
        )}
      </Mutation>
    );
  }
}

export default Form.create()(LoginPage);
