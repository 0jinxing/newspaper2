import styles from './UserAuthLayout.css';

export default ({ title, children }) => {
  return (
    <div className={styles.wrap}>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
