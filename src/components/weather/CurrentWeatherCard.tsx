import styles from "../../App.module.scss";
import { useCurrentWeatherCard } from "./useCurrentWeatherCard";

type CurrentWeatherCardProps = {
  temperature: string;
};

export function CurrentWeatherCard({
  temperature,
}: CurrentWeatherCardProps) {
  const { backgroundStyle, city, dateLabel, icon } =
    useCurrentWeatherCard();

  return (
    <article className={styles.currentCard} style={backgroundStyle}>
      <div className={styles.currentContent}>
        <div>
          <h2 className={styles.location}>{city}</h2>
          <p className={styles.date}>{dateLabel}</p>
        </div>

        <div className={styles.currentWeather}>
          <img src={icon} alt="" />
          <p className={styles.currentTemperature}>{temperature}</p>
        </div>
      </div>
    </article>
  );
}
