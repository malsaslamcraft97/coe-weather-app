import React, { useCallback } from "react";
import styles from "../../App.module.scss";
import type { ForecastDay } from "../../data/weather";
import { useDailyForecast } from "./useDailyForecast";

type DailyForecastProps = {
  forecastDays: ForecastDay[];
  selectedDay: string;
  onSelectDay: (dayId: string) => void;
  isLoading?: boolean;
};

export const DailyForecast = React.memo(function DailyForecast({
  forecastDays,
  selectedDay,
  onSelectDay,
  isLoading = false,
}: DailyForecastProps) {
  const { title, emptyLabel } = useDailyForecast();

  const handleSelect = useCallback(
    (id: string) => {
      onSelectDay(id);
    },
    [onSelectDay],
  );

  if (isLoading) {
    return (
      <section className={styles.forecastSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>

        <div className={styles.dailyGrid}>
          {Array.from({ length: 7 }, (_, index) => (
            <article className={styles.dayCard} key={index}>
              <div className={styles.dayNameSkeleton} />
              <div className={styles.daySkeletonIcon} />
              <div className={styles.dayRangeSkeleton} />
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
          <DayCard
            key={day.id}
            day={day}
            isActive={day.id === selectedDay}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
});

/* Memoized card to avoid unnecessary re-renders */
const DayCard = React.memo(function DayCard({
  day,
  isActive,
  onSelect,
}: {
  day: ForecastDay;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      className={styles.dayCard}
      data-active={isActive}
      type="button"
      onClick={() => onSelect(day.id)}
    >
      <span className={styles.dayName}>{day.day}</span>
      <img className={styles.dayIcon} src={day.icon} alt="" />
      <span className={styles.dayRange}>
        <span>{day.high}°</span>
        <span>{day.low}°</span>
      </span>
    </button>
  );
});
