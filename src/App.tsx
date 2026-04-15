import { FormEvent, useMemo, useState } from 'react';
import styles from './App.module.scss';
import logo from '../starter-files/assets/images/logo.svg';
import searchIcon from '../starter-files/assets/images/icon-search.svg';
import unitsIcon from '../starter-files/assets/images/icon-units.svg';
import dropdownIcon from '../starter-files/assets/images/icon-dropdown.svg';
import checkmarkIcon from '../starter-files/assets/images/icon-checkmark.svg';
import sunnyIcon from '../starter-files/assets/images/icon-sunny.webp';
import partlyCloudyIcon from '../starter-files/assets/images/icon-partly-cloudy.webp';
import rainIcon from '../starter-files/assets/images/icon-rain.webp';
import drizzleIcon from '../starter-files/assets/images/icon-drizzle.webp';
import stormIcon from '../starter-files/assets/images/icon-storm.webp';
import fogIcon from '../starter-files/assets/images/icon-fog.webp';
import bgTodayLarge from '../starter-files/assets/images/bg-today-large.svg';

type UnitSystem = 'metric' | 'imperial';

type ForecastDay = {
  id: string;
  day: string;
  icon: string;
  condition: string;
  high: number;
  low: number;
};

type HourlyEntry = {
  time: string;
  icon: string;
  condition: string;
  temperature: number;
};

const forecastDays: ForecastDay[] = [
  { id: 'tue', day: 'Tue', icon: drizzleIcon, condition: 'Drizzle', high: 20, low: 14 },
  { id: 'wed', day: 'Wed', icon: rainIcon, condition: 'Rain', high: 21, low: 15 },
  { id: 'thu', day: 'Thu', icon: sunnyIcon, condition: 'Sunny', high: 24, low: 14 },
  { id: 'fri', day: 'Fri', icon: partlyCloudyIcon, condition: 'Partly cloudy', high: 25, low: 13 },
  { id: 'sat', day: 'Sat', icon: stormIcon, condition: 'Storm', high: 21, low: 15 },
  { id: 'sun', day: 'Sun', icon: rainIcon, condition: 'Snow', high: 25, low: 16 },
  { id: 'mon', day: 'Mon', icon: fogIcon, condition: 'Fog', high: 24, low: 15 },
];

const hourlyByDay: Record<string, HourlyEntry[]> = {
  tue: [
    { time: '3 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 20 },
    { time: '4 PM', icon: partlyCloudyIcon, condition: 'Partly cloudy', temperature: 20 },
    { time: '5 PM', icon: sunnyIcon, condition: 'Sunny', temperature: 20 },
    { time: '6 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 19 },
    { time: '7 PM', icon: rainIcon, condition: 'Rain', temperature: 18 },
    { time: '8 PM', icon: fogIcon, condition: 'Fog', temperature: 18 },
    { time: '9 PM', icon: rainIcon, condition: 'Rain', temperature: 17 },
    { time: '10 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 17 },
  ],
  wed: [
    { time: '3 PM', icon: rainIcon, condition: 'Rain', temperature: 21 },
    { time: '4 PM', icon: rainIcon, condition: 'Rain', temperature: 20 },
    { time: '5 PM', icon: drizzleIcon, condition: 'Drizzle', temperature: 19 },
    { time: '6 PM', icon: drizzleIcon, condition: 'Drizzle', temperature: 18 },
    { time: '7 PM', icon: partlyCloudyIcon, condition: 'Cloud breaks', temperature: 17 },
    { time: '8 PM', icon: fogIcon, condition: 'Fog', temperature: 17 },
    { time: '9 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 16 },
    { time: '10 PM', icon: rainIcon, condition: 'Shower', temperature: 15 },
  ],
  thu: [
    { time: '3 PM', icon: sunnyIcon, condition: 'Sunny', temperature: 24 },
    { time: '4 PM', icon: sunnyIcon, condition: 'Sunny', temperature: 23 },
    { time: '5 PM', icon: sunnyIcon, condition: 'Sunny', temperature: 22 },
    { time: '6 PM', icon: partlyCloudyIcon, condition: 'Partly cloudy', temperature: 21 },
    { time: '7 PM', icon: partlyCloudyIcon, condition: 'Partly cloudy', temperature: 19 },
    { time: '8 PM', icon: fogIcon, condition: 'Fog', temperature: 18 },
    { time: '9 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 17 },
    { time: '10 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 16 },
  ],
  fri: [
    { time: '3 PM', icon: partlyCloudyIcon, condition: 'Partly cloudy', temperature: 25 },
    { time: '4 PM', icon: partlyCloudyIcon, condition: 'Partly cloudy', temperature: 24 },
    { time: '5 PM', icon: sunnyIcon, condition: 'Sunny', temperature: 22 },
    { time: '6 PM', icon: sunnyIcon, condition: 'Sunny', temperature: 21 },
    { time: '7 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 19 },
    { time: '8 PM', icon: fogIcon, condition: 'Fog', temperature: 18 },
    { time: '9 PM', icon: rainIcon, condition: 'Light rain', temperature: 16 },
    { time: '10 PM', icon: rainIcon, condition: 'Shower', temperature: 15 },
  ],
  sat: [
    { time: '3 PM', icon: stormIcon, condition: 'Storm', temperature: 21 },
    { time: '4 PM', icon: stormIcon, condition: 'Storm', temperature: 20 },
    { time: '5 PM', icon: rainIcon, condition: 'Rain', temperature: 19 },
    { time: '6 PM', icon: rainIcon, condition: 'Rain', temperature: 18 },
    { time: '7 PM', icon: drizzleIcon, condition: 'Drizzle', temperature: 17 },
    { time: '8 PM', icon: fogIcon, condition: 'Fog', temperature: 16 },
    { time: '9 PM', icon: partlyCloudyIcon, condition: 'Clearing', temperature: 15 },
    { time: '10 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 15 },
  ],
  sun: [
    { time: '3 PM', icon: rainIcon, condition: 'Snow', temperature: 25 },
    { time: '4 PM', icon: rainIcon, condition: 'Snow', temperature: 23 },
    { time: '5 PM', icon: drizzleIcon, condition: 'Wintry mix', temperature: 21 },
    { time: '6 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 20 },
    { time: '7 PM', icon: fogIcon, condition: 'Fog', temperature: 18 },
    { time: '8 PM', icon: fogIcon, condition: 'Fog', temperature: 17 },
    { time: '9 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 17 },
    { time: '10 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 16 },
  ],
  mon: [
    { time: '3 PM', icon: fogIcon, condition: 'Fog', temperature: 24 },
    { time: '4 PM', icon: fogIcon, condition: 'Fog', temperature: 22 },
    { time: '5 PM', icon: partlyCloudyIcon, condition: 'Cloud breaks', temperature: 21 },
    { time: '6 PM', icon: partlyCloudyIcon, condition: 'Cloudy', temperature: 20 },
    { time: '7 PM', icon: rainIcon, condition: 'Rain', temperature: 19 },
    { time: '8 PM', icon: rainIcon, condition: 'Rain', temperature: 18 },
    { time: '9 PM', icon: fogIcon, condition: 'Fog', temperature: 17 },
    { time: '10 PM', icon: fogIcon, condition: 'Fog', temperature: 17 },
  ],
};

function App() {
  const [query, setQuery] = useState('Berlin, Germany');
  const [selectedDay, setSelectedDay] = useState('tue');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);

  const currentTemperature = unitSystem === 'metric' ? '20°' : '68°';
  const metricCards = useMemo(
    () => [
      { label: 'Feels Like', value: unitSystem === 'metric' ? '18°' : '64°' },
      { label: 'Humidity', value: '46%' },
      { label: 'Wind', value: unitSystem === 'metric' ? '14 km/h' : '9 mph' },
      { label: 'Precipitation', value: unitSystem === 'metric' ? '0 mm' : '0 in' },
    ],
    [unitSystem],
  );

  const hourlyForecast = hourlyByDay[selectedDay];
  const selectedDayLabel =
    forecastDays.find((day) => day.id === selectedDay)?.day ?? 'Tue';

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.brand} href="/" aria-label="Weather Now home">
            <img src={logo} alt="" />
          </a>

          <div className={styles.unitSwitch}>
            <button
              className={styles.unitButton}
              type="button"
              aria-expanded={isUnitsOpen}
              aria-haspopup="true"
              onClick={() => setIsUnitsOpen((open) => !open)}
            >
              <span className={styles.unitButtonLabel}>
                <img src={unitsIcon} alt="" />
                Units
              </span>
              <img
                className={styles.dropdownIcon}
                src={dropdownIcon}
                alt=""
              />
            </button>

            {isUnitsOpen ? (
              <div className={styles.unitMenu}>
                <button
                  className={styles.unitMenuItem}
                  type="button"
                  onClick={() => {
                    setUnitSystem('metric');
                    setIsUnitsOpen(false);
                  }}
                >
                  <span>Metric</span>
                  {unitSystem === 'metric' ? (
                    <img src={checkmarkIcon} alt="" />
                  ) : null}
                </button>
                <button
                  className={styles.unitMenuItem}
                  type="button"
                  onClick={() => {
                    setUnitSystem('imperial');
                    setIsUnitsOpen(false);
                  }}
                >
                  <span>Imperial</span>
                  {unitSystem === 'imperial' ? (
                    <img src={checkmarkIcon} alt="" />
                  ) : null}
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>How&apos;s the sky looking today?</h1>

          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <label className={styles.searchField}>
              <img src={searchIcon} alt="" />
              <span className={styles.srOnly}>Search location</span>
              <input
                type="search"
                name="location"
                placeholder="Search for a place..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button className={styles.searchButton} type="submit">
              Search
            </button>
          </form>
        </section>

        <section className={styles.dashboard}>
          <div className={styles.mainColumn}>
            <article
              className={styles.currentCard}
              style={{ backgroundImage: `url(${bgTodayLarge})` }}
            >
              <div className={styles.currentContent}>
                <div>
                  <h2 className={styles.location}>Berlin, Germany</h2>
                  <p className={styles.date}>Tuesday, Aug 5, 2025</p>
                </div>

                <div className={styles.currentWeather}>
                  <img src={sunnyIcon} alt="" />
                  <p className={styles.currentTemperature}>{currentTemperature}</p>
                </div>
              </div>
            </article>

            <section className={styles.metricsGrid} aria-label="Current metrics">
              {metricCards.map((card) => (
                <article className={styles.metricCard} key={card.label}>
                  <p className={styles.metricLabel}>{card.label}</p>
                  <p className={styles.metricValue}>{card.value}</p>
                </article>
              ))}
            </section>

            <section className={styles.forecastSection}>
              <h2 className={styles.sectionTitle}>Daily forecast</h2>

              <div className={styles.dailyGrid}>
                {forecastDays.map((day) => (
                  <button
                    className={styles.dayCard}
                    data-active={day.id === selectedDay}
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDay(day.id)}
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
          </div>

          <aside className={styles.hourlyPanel}>
            <div className={styles.hourlyHeader}>
              <h2 className={styles.hourlyTitle}>Hourly forecast</h2>
              <button className={styles.dayPicker} type="button">
                <span>{selectedDayLabel === 'Tue' ? 'Tuesday' : selectedDayLabel}</span>
                <img src={dropdownIcon} alt="" />
              </button>
            </div>

            <div className={styles.hourlyList}>
              {hourlyForecast.map((item) => (
                <article className={styles.hourlyCard} key={`${selectedDay}-${item.time}`}>
                  <div className={styles.hourlySummary}>
                    <img src={item.icon} alt="" />
                    <div>
                      <p className={styles.hourlyTime}>{item.time}</p>
                      <p className={styles.hourlyCondition}>{item.condition}</p>
                    </div>
                  </div>
                  <p className={styles.hourlyTemp}>{item.temperature}°</p>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default App;
