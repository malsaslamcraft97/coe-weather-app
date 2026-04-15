import styles from "../../App.module.scss";
import { useWeatherMetrics } from "./useWeatherMetrics";
import type { MetricCard } from "../../data/weather";

type WeatherMetricsProps = {
  metricCards: MetricCard[];
  isLoading?: boolean;
};

export function WeatherMetrics({
  metricCards,
  isLoading = false,
}: WeatherMetricsProps) {
  const { ariaLabel, emptyLabel } = useWeatherMetrics();

  if (isLoading) {
    return (
      <section className={styles.metricsGrid} aria-label={ariaLabel}>
        {["Feels Like", "Humidity", "Wind", "Precipitation"].map((label) => (
          <article className={styles.metricCard} key={label}>
            <p className={styles.metricLabel}>{label}</p>
            <p className={styles.metricValue}>—</p>
          </article>
        ))}
      </section>
    );
  }

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
