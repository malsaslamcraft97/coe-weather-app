import bgTodayLarge from "../../../starter-files/assets/images/bg-today-large.svg";

export function useCurrentWeatherCard() {
  return {
    backgroundStyle: {
      backgroundImage: `url(${bgTodayLarge})`,
    },
  };
}
