import drizzleIcon from "../../starter-files/assets/images/icon-drizzle.webp";
import fogIcon from "../../starter-files/assets/images/icon-fog.webp";
import overcastIcon from "../../starter-files/assets/images/icon-overcast.webp";
import partlyCloudyIcon from "../../starter-files/assets/images/icon-partly-cloudy.webp";
import rainIcon from "../../starter-files/assets/images/icon-rain.webp";
import snowIcon from "../../starter-files/assets/images/icon-snow.webp";
import stormIcon from "../../starter-files/assets/images/icon-storm.webp";
import sunnyIcon from "../../starter-files/assets/images/icon-sunny.webp";

export function getWeatherVisual(weatherCode?: number | null) {
  if (weatherCode === 0) {
    return { icon: sunnyIcon, label: "Sunny" };
  }

  if (weatherCode === 1 || weatherCode === 2) {
    return { icon: partlyCloudyIcon, label: "Partly cloudy" };
  }

  if (weatherCode === 3) {
    return { icon: overcastIcon, label: "Overcast" };
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return { icon: fogIcon, label: "Fog" };
  }

  if (
    weatherCode === 51 ||
    weatherCode === 53 ||
    weatherCode === 55 ||
    weatherCode === 56 ||
    weatherCode === 57
  ) {
    return { icon: drizzleIcon, label: "Drizzle" };
  }

  if (
    weatherCode === 61 ||
    weatherCode === 63 ||
    weatherCode === 65 ||
    weatherCode === 66 ||
    weatherCode === 67 ||
    weatherCode === 80 ||
    weatherCode === 81 ||
    weatherCode === 82
  ) {
    return { icon: rainIcon, label: "Rain" };
  }

  if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75 || weatherCode === 77 || weatherCode === 85 || weatherCode === 86) {
    return { icon: snowIcon, label: "Snow" };
  }

  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    return { icon: stormIcon, label: "Storm" };
  }

  return { icon: overcastIcon, label: "Weather" };
}
