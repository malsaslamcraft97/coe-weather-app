import { useState } from "react";
import dropdownIcon from "../../../starter-files/assets/images/icon-dropdown.svg";

export function useHourlyForecastPanel(selectedDayLabel: string) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [unit, setUnit] = useState<"C" | "F">("C");

  const convertTemperature = (temp: number) => {
    if (unit === "F") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  return {
    title: "Hourly forecast",

    // ✅ Minimal toggle label (optional but helps UX)
    displayDayLabel: selectedDayIndex === 0 ? selectedDayLabel : "Thu",

    dropdownIcon,
    emptyLabel: "No hourly forecast is available for this day yet.",

    formatTemperature: (temperature: number | null | undefined) =>
      typeof temperature === "number"
        ? `${convertTemperature(temperature)}°`
        : "--",

    selectedDayIndex,
    setSelectedDayIndex,
    unit,
    setUnit,
  };
}
