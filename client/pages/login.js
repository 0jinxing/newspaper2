import { Component } from 'react';
import { Input, Icon, Form, Button } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import BasicLayout from '../layouts/BasicLayout';

const signinUser = gql`

`

@Form.create()
class LoginPage extends Component {
  render() {
  }
}

export default LoginPage;