import { Component } from 'react';
import { Layout, Mention } from 'antd';
import './TopHeader.less';

const { Header } = Layout;

export default class TopHeader extends Component {
  render() {
    const { className, collapsed } = this.props;
    return (
      <Header className={className} style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div style={{ height: '31px', width: '24em', float: 'left', marginLeft: collapsed? "96px": "216px" }}>
          <Mention />
        </div>
      </Header>
    );
  }
}
