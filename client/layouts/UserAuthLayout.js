import React from 'react';
import styles from './UserAuthLayout.css';

class UserAuthLayout extends React.Component {
  render() {
    const { children, title } = this.props;
    return (
      <div className={styles.wrap}>
        <h2 className={styles.title}>{title}</h2>
        <div>{children}</div>
      </div>
    );
  }
}

export default UserAuthLayout;
