import styles from "../../App.module.scss";
import type { ForecastDay } from "../../data/weather";
import { useDailyForecast } from "./useDailyForecast";

type DailyForecastProps = {
  forecastDays: ForecastDay[];
  selectedDay: string;
  onSelectDay: (dayId: string) => void;
  isLoading?: boolean;
};

export function DailyForecast({
  forecastDays,
  selectedDay,
  onSelectDay,
  isLoading = false,
}: DailyForecastProps) {
  const { title, emptyLabel } = useDailyForecast();

  if (isLoading) {
    return (
      <section className={styles.forecastSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.dailyGrid}>
          {Array.from({ length: 7 }, (_, index) => (
            <article className={styles.dayCard} key={index}>
              <span className={styles.dayName}>&nbsp;</span>
              <span className={styles.daySkeletonIcon} />
              <span className={styles.dayRange}>
                <span> </span>
                <span> </span>
              </span>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (forecastDays.length === 0) {
    return (
      <section className={styles.forecastSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.emptyState}>{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className={styles.forecastSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div className={styles.dailyGrid}>
        {forecastDays.map((day) => (
          <button
            className={styles.dayCard}
            data-active={day.id === selectedDay}
            key={day.id}
            type="button"
            onClick={() => onSelectDay(day.id)}
          >
            <span className={styles.dayName}>{day.day}</span>
            <img className={styles.dayIcon} src={day.icon} alt="" />
            <span className={styles.dayRange}>
              <span>{day.high}°</span>
              <span>{day.low}°</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
