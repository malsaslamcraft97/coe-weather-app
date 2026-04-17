import styles from "../../App.module.scss";
import { useAppContext } from "../../context/AppProvider";
import type { HourlyEntry } from "../../data/weather";
import { useHourlyForecastPanel } from "./useHourlyForecastPanel";
import { Tabs } from "../common/Tabs";

type HourlyForecastPanelProps = {
  hourlyForecast: HourlyEntry[];
  selectedDayLabel: string;
  isLoading?: boolean;
};

export function HourlyForecastPanel({
  hourlyForecast,
  selectedDayLabel,
  isLoading = false,
}: HourlyForecastPanelProps) {
  const { actions } = useAppContext();

  const {
    title,
    displayDayLabel,
    emptyLabel,
    formatTemperature,
    selectedDayIndex,
    setSelectedDayIndex,
    isUnitOpen,
    setIsUnitOpen,
  } = useHourlyForecastPanel(selectedDayLabel);

  const getForecastByIndex = (index: number) => {
    return index === 0
      ? hourlyForecast.slice(0, 4)
      : hourlyForecast.slice(4, 8);
  };

  return (
    <aside className={styles.hourlyPanel}>
      <Tabs
        value={String(selectedDayIndex)}
        onChange={(val) => setSelectedDayIndex(Number(val))}
      >
        {/* Header */}
        <div className={styles.hourlyHeader}>
          <h2 className={styles.hourlyTitle}>{title}</h2>

          <Tabs.List>
            <Tabs.Trigger value="0">{displayDayLabel}</Tabs.Trigger>
            <Tabs.Trigger value="1">Next</Tabs.Trigger>
          </Tabs.List>

          {/* Units dropdown */}
          <div>
            <button
              data-testid="units-toggle"
              onClick={() => setIsUnitOpen((prev) => !prev)}
            >
              Units
            </button>

            {isUnitOpen && (
              <div data-testid="units-dropdown">
                <button
                  onClick={() => {
                    actions.selectUnit("metric");
                    setIsUnitOpen(false);
                  }}
                >
                  Celsius
                </button>

                <button
                  onClick={() => {
                    actions.selectUnit("imperial");
                    setIsUnitOpen(false);
                  }}
                >
                  Fahrenheit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <Tabs.Content value="0">
          <HourlyList
            data={getForecastByIndex(0)}
            isLoading={isLoading}
            emptyLabel={emptyLabel}
            formatTemperature={formatTemperature}
            selectedDayLabel={selectedDayLabel}
          />
        </Tabs.Content>

        <Tabs.Content value="1">
          <HourlyList
            data={getForecastByIndex(1)}
            isLoading={isLoading}
            emptyLabel={emptyLabel}
            formatTemperature={formatTemperature}
            selectedDayLabel={selectedDayLabel}
          />
        </Tabs.Content>
      </Tabs>
    </aside>
  );
}

/* Extracted + future-optimizable */
function HourlyList({
  data,
  isLoading,
  emptyLabel,
  formatTemperature,
  selectedDayLabel,
}: any) {
  if (isLoading) {
    return (
      <div className={styles.hourlyList}>
        {Array.from({ length: 8 }, (_, index) => (
          <article className={styles.hourlyCard} key={index}>
            <div className={styles.hourlySummary}>
              <span className={styles.hourlySkeletonIcon} />
              <div className={styles.hourlySkeletonText} />
            </div>
            <p className={styles.hourlyTemp}> </p>
          </article>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className={styles.emptyState}>{emptyLabel}</p>;
  }

  return (
    <div className={styles.hourlyList}>
      {data.map((item: any) => (
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
      ))}
    </div>
  );
}
