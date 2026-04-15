import drizzleIcon from "../../../starter-files/assets/images/icon-drizzle.webp";
import sunnyIcon from "../../../starter-files/assets/images/icon-sunny.webp";
import type { ForecastDay, HourlyEntry } from "../../data/weather";

type MetricCard = {
  label: string;
  value: string;
};

export function makeForecastDay(
  overrides: Partial<ForecastDay> = {},
): ForecastDay {
  return {
    id: "tue",
    day: "Tue",
    icon: drizzleIcon,
    condition: "Drizzle",
    high: 20,
    low: 14,
    ...overrides,
  };
}

export function makeHourlyEntry(
  overrides: Partial<HourlyEntry> = {},
): HourlyEntry {
  return {
    time: "3 PM",
    icon: sunnyIcon,
    condition: "Sunny",
    temperature: 20,
    ...overrides,
  };
}

export function makeMetricCard(
  overrides: Partial<MetricCard> = {},
): MetricCard {
  return {
    label: "Feels Like",
    value: "18°",
    ...overrides,
  };
}
