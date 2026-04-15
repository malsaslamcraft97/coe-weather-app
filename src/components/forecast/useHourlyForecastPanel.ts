import { useState } from "react";
import dropdownIcon from "../../../starter-files/assets/images/icon-dropdown.svg";

export function useHourlyForecastPanel(selectedDayLabel: string) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  return {
    title: "Hourly forecast",

    displayDayLabel: selectedDayIndex === 0 ? selectedDayLabel : "Thu",

    dropdownIcon,
    emptyLabel: "No hourly forecast is available for this day yet.",

    // ✅ NO conversion here anymore
    formatTemperature: (temperature: number | null | undefined) =>
      typeof temperature === "number" ? `${temperature}°` : "--",

    selectedDayIndex,
    setSelectedDayIndex,
    isUnitOpen,
    setIsUnitOpen,
  };
}
