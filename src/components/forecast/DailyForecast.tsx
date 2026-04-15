import styles from "../../App.module.scss";
import type { ForecastDay } from "../../data/weatherMock";
import { useDailyForecast } from "./useDailyForecast";

type DailyForecastProps = {
  forecastDays: ForecastDay[];
  selectedDay: string;
  onSelectDay: (dayId: string) => void;
};

export function DailyForecast({
  forecastDays,
  selectedDay,
  onSelectDay,
}: DailyForecastProps) {
  const { title, emptyLabel } = useDailyForecast();

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
