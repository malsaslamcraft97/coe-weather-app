import { FormEvent, useMemo, useState } from "react";
import {
  forecastDays,
  hourlyByDay,
  type UnitSystem,
} from "./data/weatherMock";

export function useApp() {
  const [query, setQuery] = useState("Berlin, Germany");
  const [selectedDay, setSelectedDay] = useState("tue");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);

  const currentTemperature = unitSystem === "metric" ? "20°" : "68°";

  const metricCards = useMemo(
    () => [
      { label: "Feels Like", value: unitSystem === "metric" ? "18°" : "64°" },
      { label: "Humidity", value: "46%" },
      { label: "Wind", value: unitSystem === "metric" ? "14 km/h" : "9 mph" },
      {
        label: "Precipitation",
        value: unitSystem === "metric" ? "0 mm" : "0 in",
      },
    ],
    [unitSystem],
  );

  const hourlyForecast = hourlyByDay[selectedDay] ?? [];
  const selectedDayLabel =
    forecastDays.find((day) => day.id === selectedDay)?.day ?? "Tue";

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return {
    query,
    selectedDay,
    unitSystem,
    isUnitsOpen,
    currentTemperature,
    metricCards,
    forecastDays,
    hourlyForecast,
    selectedDayLabel,
    setQuery,
    setSelectedDay,
    setUnitSystem,
    setIsUnitsOpen,
    handleSearchSubmit,
  };
}
