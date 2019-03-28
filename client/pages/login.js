import { Component } from 'react';
import router from 'next/router';
import { Mutation } from 'react-apollo';
import { Input, Icon, Form, Button, Checkbox } from 'antd';
import gql from 'graphql-tag';
import BasicLayout from '../layouts/BasicLayout';
import './Login.css';

const FormItem = Form.Item;

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
          <BasicLayout>
            <h1 className="login-form-title">Login to 2newspaper</h1>
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
              className="login-form"
            >
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: '邮箱格式不正确' },
                  ],
                })(<Input prefix={<Icon type="user" />} placeholder="Email" />)}
              </FormItem>

              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your password!' }],
                })(<Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />)}
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
                  Log in
                </Button>
                Or <a href="">register now!</a>
              </FormItem>
            </Form>
          </BasicLayout>
        )}
      </Mutation>
    );
  }
}

export default Form.create()(LoginPage);
