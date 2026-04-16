import styles from "./App.module.scss";
import { DailyForecast } from "./components/forecast/DailyForecast";
import { HourlyForecastPanel } from "./components/forecast/HourlyForecastPanel";
import { AppHeader } from "./components/layout/AppHeader";
import { SearchHero } from "./components/search/SearchHero";
import { CurrentWeatherCard } from "./components/weather/CurrentWeatherCard";
import { WeatherMetrics } from "./components/weather/WeatherMetrics";
import { useApp } from "./useApp";
import errorIcon from "../starter-files/assets/images/icon-error.svg";
import retryIcon from "../starter-files/assets/images/icon-retry.svg";
import { useAppContext } from "./context/AppProvider";
import { Login } from "./components/auth/Login";

function App() {
  const { state } = useAppContext();

  // ✅ AUTH GUARD
  if (!state.isAuthenticated) {
    return <Login />;
  }

  const {
    query,
    status,
    selectedDay,
    unitSystem,
    isUnitsOpen,
    weather,
    forecastDays,
    hourlyForecast,
    selectedDayLabel,
    errorMessage,
    setQuery,
    setSelectedDay,
    selectUnit,
    toggleUnitsMenu,
    handleSearchSubmit,
    retrySearch,
    unit,
    setUnit,
    logout,
  } = useApp();

  const showDashboard =
    status === "ready" || status === "searching" || status === "loading";
  const showSearchProgress = status === "searching";
  const showLoadingDashboard = status === "loading" && !weather;
  const showNoResults = status === "no-results";
  const showError = status === "error";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <AppHeader
          isUnitsOpen={isUnitsOpen}
          unitSystem={unitSystem}
          onToggleUnits={toggleUnitsMenu}
          onSelectUnit={selectUnit}
          onLogout={logout}
        />

        <SearchHero
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearchSubmit}
          searchStatusLabel={showSearchProgress ? "Search in progress" : ""}
        />

        {showNoResults ? (
          <section className={styles.messageState}>
            <h2 className={styles.messageTitle}>No search result found!</h2>
          </section>
        ) : null}

        {showError ? (
          <section className={styles.errorState}>
            <img className={styles.errorIcon} src={errorIcon} alt="" />
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorCopy}>{errorMessage}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void retrySearch()}
            >
              <img src={retryIcon} alt="" />
              Retry
            </button>
          </section>
        ) : null}

        {showDashboard ? (
          <section className={styles.dashboard}>
            <div className={styles.mainColumn}>
              <CurrentWeatherCard
                weatherCard={weather?.currentCard ?? null}
                isLoading={showLoadingDashboard}
              />
              <WeatherMetrics
                metricCards={weather?.metricCards ?? []}
                isLoading={showLoadingDashboard}
              />
              <DailyForecast
                forecastDays={forecastDays}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                isLoading={showLoadingDashboard}
              />
            </div>

            <HourlyForecastPanel
              hourlyForecast={hourlyForecast}
              selectedDayLabel={showLoadingDashboard ? "-" : selectedDayLabel}
              isLoading={showLoadingDashboard}
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default App;
