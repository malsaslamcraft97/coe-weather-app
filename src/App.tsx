import styles from "./App.module.scss";
import { DailyForecast } from "./components/forecast/DailyForecast";
import { HourlyForecastPanel } from "./components/forecast/HourlyForecastPanel";
import { AppHeader } from "./components/layout/AppHeader";
import { SearchHero } from "./components/search/SearchHero";
import { CurrentWeatherCard } from "./components/weather/CurrentWeatherCard";
import { WeatherMetrics } from "./components/weather/WeatherMetrics";
import { useApp } from "./useApp";

function App() {
  const {
    query,
    selectedDay,
    unitSystem,
    isUnitsOpen,
    currentTemperature,
    metricCards,
    forecastDays,
    hourlyForecast,
    selectedDayLabel,
    setQuery,
    setSelectedDay,
    setUnitSystem,
    setIsUnitsOpen,
    handleSearchSubmit,
  } = useApp();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <AppHeader
          isUnitsOpen={isUnitsOpen}
          unitSystem={unitSystem}
          onToggleUnits={() => setIsUnitsOpen((open) => !open)}
          onSelectUnit={(nextUnit) => {
            setUnitSystem(nextUnit);
            setIsUnitsOpen(false);
          }}
        />

        <SearchHero
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearchSubmit}
        />

        <section className={styles.dashboard}>
          <div className={styles.mainColumn}>
            <CurrentWeatherCard temperature={currentTemperature} />
            <WeatherMetrics metricCards={metricCards} />
            <DailyForecast
              forecastDays={forecastDays}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </div>

          <HourlyForecastPanel
            hourlyForecast={hourlyForecast}
            selectedDayLabel={selectedDayLabel}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
