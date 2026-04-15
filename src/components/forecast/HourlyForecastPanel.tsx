import styles from "../../App.module.scss";
import type { HourlyEntry } from "../../data/weatherMock";
import { useHourlyForecastPanel } from "./useHourlyForecastPanel";

type HourlyForecastPanelProps = {
  hourlyForecast: HourlyEntry[];
  selectedDayLabel: string;
};

export function HourlyForecastPanel({
  hourlyForecast,
  selectedDayLabel,
}: HourlyForecastPanelProps) {
  const { title, displayDayLabel, dropdownIcon, emptyLabel, formatTemperature } =
    useHourlyForecastPanel(selectedDayLabel);

  return (
    <aside className={styles.hourlyPanel}>
      <div className={styles.hourlyHeader}>
        <h2 className={styles.hourlyTitle}>{title}</h2>
        <button className={styles.dayPicker} type="button">
          <span>{displayDayLabel}</span>
          <img src={dropdownIcon} alt="" />
        </button>
      </div>

      <div className={styles.hourlyList}>
        {hourlyForecast.length === 0 ? (
          <p className={styles.emptyState}>{emptyLabel}</p>
        ) : (
          hourlyForecast.map((item) => (
            <article
              className={styles.hourlyCard}
              key={`${selectedDayLabel}-${item.time}`}
            >
              <div className={styles.hourlySummary}>
                {item.icon ? <img src={item.icon} alt="" /> : null}
                <div>
                  <p className={styles.hourlyTime}>{item.time}</p>
                  <p className={styles.hourlyCondition}>{item.condition}</p>
                </div>
              </div>
              <p className={styles.hourlyTemp}>
                {formatTemperature(item.temperature)}
              </p>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
