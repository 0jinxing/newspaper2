import styles from './UserAuthLayout.css';

export default ({ title, children }) => {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>
      <div>{children}</div>
    </div>
  );
};
