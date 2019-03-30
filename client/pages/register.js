import { Component } from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { Layout, Input, Icon, Form, Button, Checkbox, Card } from 'antd';
import gql from 'graphql-tag';
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

class RegisterPage extends Component {
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
          <Layout className="sign-wrap">
            <Header>
              <p className="sentence">承认自己并非你所以为的那种人，称得上是一种相当可怕的经历。</p>
            </Header>
            <Content>
              <Card className="sign-form-card">
                <div className="info-wrap">
                  <img src="/static/backpack.png" />
                  <h1>Sign up for 2Newspaper</h1>
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
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: 'Please input your username!' }],
                    })(<Input prefix={<Icon type="user" />} placeholder="Username" />)}
                  </FormItem>
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
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      className="sign-form-button"
                    >
                      Sign up
                    </Button>
                    Or{' '}
                    <Link href={{ pathname: '/login', query: { name: 1 } }}>
                      <a>login now!</a>
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

export default Form.create()(RegisterPage);
