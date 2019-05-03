import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import {
  FormGroup,
  InputGroup,
  Button,
  Tooltip,
  Intent,
  Icon,
  Toaster,
  Position,
} from '@blueprintjs/core';
import cookie from 'cookie';
import Layout from '@/layouts/UserAuthLayout';
import styles from './auth.css';

const SIGN_UP_USER = gql`
  mutation SignUpUser($username: String!, $email: String!, $password: String!) {
    signUpUser(username: $username, email: $email, password: $password) {
      accessToken
      accessExpires
      refreshToken
      accessExpires
    }
  }
`;

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };
  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };
  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <Mutation mutation={SIGN_UP_USER}>
        {(signUpUser, { error, data, loading }) => (
          <Layout title="注册 2NEWSPAPER">
            <FormGroup label="昵称">
              <InputGroup
                placeholder="输入你的昵称..."
                leftIcon="user"
                onChange={this.handleUsernameChange}
              />
            </FormGroup>
            <FormGroup label="邮箱">
              <InputGroup
                placeholder="输入你的邮箱..."
                leftIcon="link"
                onChange={this.handleEmailChange}
              />
            </FormGroup>
            <FormGroup label="密码">
              <InputGroup
                leftIcon="lock"
                placeholder="输入你的密码..."
                type="password"
                onChange={this.handlePasswordChange}
              />
            </FormGroup>
            <FormGroup label="确认密码">
              <InputGroup leftIcon="confirm" placeholder="确认你的密码..." type="password" />
            </FormGroup>
            <Button
              type="submit"
              icon="log-in"
              intent="primary"
              fill
              loading={loading}
              onClick={() => {
                const { username, password, email } = this.state;
                signUpUser({ variables: { username, password, email } })
                  .then(result => {
                    const {
                      data: { signUpUser },
                    } = result;
                    window.opener.postMessage({ type: 'SIGN_IN', ...signUpUser }, location.origin);
                    window.close();
                  })
                  .catch(error => {
                    (error.graphQLErrors || []).map(e => {
                      this.toaster.show({
                        message: e.message,
                        intent: Intent.DANGER,
                        icon: 'warning-sign',
                        timeout: 2000,
                      });
                    });
                  });
              }}
            >
              注册
            </Button>
            <div className={styles.links}>
              <p>
                <Link href="/user/auth/login">
                  <a>已有有账号，现在登录</a>
                </Link>
              </p>
            </div>
            <Toaster position={Position.TOP} ref={r => (this.toaster = r)} />
          </Layout>
        )}
      </Mutation>
    );
  }
}

export default Register;
