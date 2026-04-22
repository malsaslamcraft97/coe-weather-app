import { Suspense } from "react";
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
import { withAuth } from "./components/auth/withAuth";
import { AppLoader } from "./components/common/AppLoader";

function App() {
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
    logout,
  } = useApp();

  const showDashboard =
    status === "ready" || status === "searching" || status === "loading";

  const showSearchProgress = status === "searching";
  const showLoadingDashboard = status === "loading" && !weather;
  const showNoResults = status === "no-results";
  const showError = status === "error";

  return (
    <>
      <AppHeader
        isUnitsOpen={isUnitsOpen}
        unitSystem={unitSystem}
        onToggleUnits={toggleUnitsMenu}
        onSelectUnit={selectUnit}
        onLogout={logout}
      />

      {/* MAIN LANDMARK */}
      <main className={styles.page}>
        {/* Page-level heading (screen-reader visible only) */}
        <h1 className={styles.srOnly}>Weather Dashboard</h1>

        <div className={styles.shell}>
          {/* SEARCH REGION */}
          <section aria-labelledby="search-heading">
            <h2 id="search-heading" className={styles.srOnly}>
              Search location
            </h2>

            <SearchHero
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSearchSubmit}
              searchStatusLabel={showSearchProgress ? "Search in progress" : ""}
            />
          </section>

          {showNoResults && (
            <section
              aria-labelledby="no-results-heading"
              className={styles.messageState}
            >
              <h2 id="no-results-heading" className={styles.messageTitle}>
                No search result found!
              </h2>
            </section>
          )}

          {showError && (
            <section
              aria-labelledby="error-heading"
              className={styles.errorState}
            >
              <h2 id="error-heading" className={styles.errorTitle}>
                Something went wrong
              </h2>

              <img className={styles.errorIcon} src={errorIcon} alt="" />
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
          )}

          {showDashboard && (
            <Suspense fallback={<AppLoader />}>
              <div className={styles.dashboard}>
                {/* MAIN CONTENT COLUMN */}
                <div className={styles.mainColumn}>
                  <section aria-labelledby="current-weather-heading">
                    <h2 id="current-weather-heading" className={styles.srOnly}>
                      Current weather
                    </h2>

                    <CurrentWeatherCard
                      weatherCard={weather?.currentCard ?? null}
                      isLoading={showLoadingDashboard}
                    />
                  </section>

                  <section aria-labelledby="weather-metrics-heading">
                    <h2 id="weather-metrics-heading" className={styles.srOnly}>
                      Weather metrics
                    </h2>

                    <WeatherMetrics
                      metricCards={weather?.metricCards ?? []}
                      isLoading={showLoadingDashboard}
                    />
                  </section>

                  <section aria-labelledby="daily-forecast-heading">
                    <h2 id="daily-forecast-heading" className={styles.srOnly}>
                      Daily forecast
                    </h2>

                    <DailyForecast
                      forecastDays={forecastDays}
                      selectedDay={selectedDay}
                      onSelectDay={setSelectedDay}
                      isLoading={showLoadingDashboard}
                    />
                  </section>
                </div>

                {/* ASIDE (COMPLEMENTARY LANDMARK FIX) */}
                <aside
                  aria-labelledby="hourly-forecast-heading"
                  className={styles.sidebar}
                >
                  <h2 id="hourly-forecast-heading" className={styles.srOnly}>
                    Hourly forecast
                  </h2>

                  <HourlyForecastPanel
                    hourlyForecast={hourlyForecast}
                    selectedDayLabel={
                      showLoadingDashboard ? "-" : selectedDayLabel
                    }
                    isLoading={showLoadingDashboard}
                  />
                </aside>
              </div>
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}

export default withAuth(App);
