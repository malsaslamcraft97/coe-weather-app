import { useState } from "react";
import dropdownIcon from "../../../starter-files/assets/images/icon-dropdown.svg";

export function useHourlyForecastPanel(selectedDayLabel: string) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  return {
    title: "Hourly forecast",

    // ✅ Minimal toggle label (optional but helps UX)
    displayDayLabel: selectedDayIndex === 0 ? selectedDayLabel : "Thu",

    dropdownIcon,
    emptyLabel: "No hourly forecast is available for this day yet.",

    formatTemperature: (temperature: number | null | undefined) =>
      typeof temperature === "number" ? `${temperature}°` : "--",

    selectedDayIndex,
    setSelectedDayIndex,
  };
}
