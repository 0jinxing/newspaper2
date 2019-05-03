import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import {
  InputGroup,
  Button,
  Tooltip,
  Intent,
  FormGroup,
  Toaster,
  Position,
} from '@blueprintjs/core';
import cookie from 'cookie';
import Layout from '@/layouts/UserAuthLayout';
import ValidFormGroup from '@/components/ValidFormGroup';
import styles from './auth.css';

const SIGN_IN_USER = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(email: $email, password: $password) {
      accessToken
      accessExpires
      refreshToken
      refreshExpires
    }
  }
`;

class Login extends React.Component {
  state = {
    showPassword: false,
    email: '',
    password: '',
  };

  handleLockClick = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    const { showPassword } = this.state;
    const lockButton = (
      <Tooltip content={`${showPassword ? '显示' : '隐藏'}密码`}>
        <Button
          icon={showPassword ? 'eye-open' : 'eye-off'}
          intent={Intent.WARNING}
          minimal={true}
          onClick={this.handleLockClick}
        />
      </Tooltip>
    );
    return (
      <Mutation mutation={SIGN_IN_USER}>
        {(signInUser, { error, data, loading }) => (
          <Layout title="登录 2NEWSPAPER">
            <ValidFormGroup label="邮箱" rules={[{ type: 'isEmail', message: '邮箱格式不正确' }]}>
              <InputGroup
                placeholder="输入你的邮箱..."
                leftIcon="link"
                onChange={this.handleEmailChange}
              />
            </ValidFormGroup>
            <FormGroup label="密码">
              <InputGroup
                onChange={this.handlePasswordChange}
                leftIcon="lock"
                placeholder="输入你的密码..."
                rightElement={lockButton}
                type={showPassword ? 'text' : 'password'}
              />
            </FormGroup>
            <Button
              type="submit"
              icon="log-in"
              intent="primary"
              fill
              loading={loading}
              onClick={() => {
                const { email, password } = this.state;
                signInUser({ variables: { email, password } })
                  .then(result => {
                    const {
                      data: { signInUser },
                    } = result;
                    window.opener.postMessage({ type: 'SIGN_IN', ...signInUser }, location.origin);
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
              登录
            </Button>
            <div className={styles.links}>
              <p>
                <Link href="/user/auth/register">
                  <a>没有账号，现在注册</a>
                </Link>
              </p>
              <p>
                <a>忘记密码</a>
              </p>
            </div>
            <Toaster position={Position.TOP} ref={r => (this.toaster = r)} />
          </Layout>
        )}
      </Mutation>
    );
  }
}

export default Login;
