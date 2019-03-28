import { Component } from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card } from 'antd';
import gql from 'graphql-tag';
import './login.less';

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
  render() {
    const {
      form: { getFieldDecorator, validateFields },
    } = this.props;

    return (
      <Mutation
        mutation={SIGNIN_USER}
        onCompleted={data => {
          const redirect = this.props.match.params.redirect;
          if (redirect) router.push(redirect);
          else router.push('/');
        }}
      >
        {(signinUser, { data, loading }) => (
          <Layout className="login-layout">
            <Header className="sentence-header">
              <p className="sentence">承认自己并非你所以为的那种人，称得上是一种相当可怕的经历。</p>
            </Header>
            <Content>
              <Card className="login-form-card">
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
                    <a className="login-form-forgot" href="">
                      Forgot password
                    </a>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Sign in
                    </Button>
                    Or <Link href="/register"><a>register now!</a></Link>
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
