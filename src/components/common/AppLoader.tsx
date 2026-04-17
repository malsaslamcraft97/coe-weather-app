import styles from "./AppLoader.module.scss";

export function AppLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <div className={styles.spinner} />
        <p className={styles.text}>Fetching weather data...</p>
      </div>
    </div>
  );
}
