import dropdownIcon from "../../../starter-files/assets/images/icon-dropdown.svg";

export function useHourlyForecastPanel(selectedDayLabel: string) {
  return {
    title: "Hourly forecast",
    displayDayLabel: selectedDayLabel === "Tue" ? "Tuesday" : selectedDayLabel,
    dropdownIcon,
    emptyLabel: "No hourly forecast is available for this day yet.",
    formatTemperature: (temperature: number | null | undefined) =>
      typeof temperature === "number" ? `${temperature}°` : "--",
  };
}
