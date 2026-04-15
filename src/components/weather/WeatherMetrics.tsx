import styles from "../../App.module.scss";
import { useWeatherMetrics } from "./useWeatherMetrics";

type MetricCard = {
  label: string;
  value: string;
};

type WeatherMetricsProps = {
  metricCards: MetricCard[];
};

export function WeatherMetrics({ metricCards }: WeatherMetricsProps) {
  const { ariaLabel, emptyLabel } = useWeatherMetrics();

  if (metricCards.length === 0) {
    return (
      <section className={styles.metricsGrid} aria-label={ariaLabel}>
        <p className={styles.emptyState}>{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className={styles.metricsGrid} aria-label={ariaLabel}>
      {metricCards.map((card) => (
        <article className={styles.metricCard} key={card.label}>
          <p className={styles.metricLabel}>{card.label}</p>
          <p className={styles.metricValue}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}
