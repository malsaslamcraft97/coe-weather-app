import { useState } from "react";
import dropdownIcon from "../../../starter-files/assets/images/icon-dropdown.svg";

export function useHourlyForecastPanel(
  selectedDayLabel: string,
  unit: "C" | "F",
) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  const convertTemperature = (temp: number) => {
    return unit === "F" ? Math.round((temp * 9) / 5 + 32) : temp;
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
    isUnitOpen,
    setIsUnitOpen,
  };
}
