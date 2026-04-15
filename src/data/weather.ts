export type UnitSystem = "metric" | "imperial";

export type MetricCard = {
  label: string;
  value: string;
};

export type ForecastDay = {
  id: string;
  day: string;
  icon: string;
  condition: string;
  high: number;
  low: number;
};

export type HourlyEntry = {
  time: string;
  icon: string;
  condition: string;
  temperature?: number | null;
};

export type CurrentWeatherCardData = {
  city: string;
  dateLabel: string;
  icon: string;
  temperature: string;
};

export type WeatherViewModel = {
  locationQuery: string;
  selectedDayId: string;
  currentCard: CurrentWeatherCardData;
  metricCards: MetricCard[];
  forecastDays: ForecastDay[];
  hourlyByDay: Record<string, HourlyEntry[]>;
};

export type AppStatus =
  | "loading"
  | "ready"
  | "searching"
  | "no-results"
  | "error";
