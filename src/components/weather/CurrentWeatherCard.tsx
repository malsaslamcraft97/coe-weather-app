import styles from "../../App.module.scss";
import { useCurrentWeatherCard } from "./useCurrentWeatherCard";
import loadingIcon from "../../../starter-files/assets/images/icon-loading.svg";
import type { CurrentWeatherCardData } from "../../data/weather";

type CurrentWeatherCardProps = {
  weatherCard: CurrentWeatherCardData | null;
  isLoading: boolean;
};

export function CurrentWeatherCard({
  weatherCard,
  isLoading,
}: CurrentWeatherCardProps) {
  const { backgroundStyle } = useCurrentWeatherCard();

  if (isLoading) {
    return (
      <article className={styles.currentCard}>
        <div className={styles.loadingCardState}>
          <img className={styles.loadingIcon} src={loadingIcon} alt="" />
          <p className={styles.loadingLabel}>Loading...</p>
        </div>
      </article>
    );
  }

  if (!weatherCard) {
    return (
      <article className={styles.currentCard}>
        <div className={styles.loadingCardState}>
          <p className={styles.loadingLabel}>Weather unavailable.</p>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.currentCard} style={backgroundStyle}>
      <div className={styles.currentContent}>
        <div>
          <h2 className={styles.location}>{weatherCard.city}</h2>
          <p className={styles.date}>{weatherCard.dateLabel}</p>
        </div>

        <div className={styles.currentWeather}>
          <img src={weatherCard.icon} alt="" />
          <p className={styles.currentTemperature}>{weatherCard.temperature}</p>
        </div>
      </div>
    </article>
  );
}
