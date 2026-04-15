import { currentWeatherCard } from "../../data/weatherMock";

export function useCurrentWeatherCard() {
  return {
    city: currentWeatherCard.city,
    dateLabel: currentWeatherCard.dateLabel,
    icon: currentWeatherCard.icon,
    backgroundStyle: {
      backgroundImage: `url(${currentWeatherCard.backgroundImage})`,
    },
  };
}
