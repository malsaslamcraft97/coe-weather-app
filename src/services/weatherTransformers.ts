import type {
  ForecastDay,
  HourlyEntry,
  MetricCard,
  UnitSystem,
  WeatherViewModel,
} from "../data/weather";
import type { ForecastResponse, LocationResult } from "./weatherClient";
import { getWeatherVisual } from "../utils/weatherIcons";

function formatTemperature(value?: number | null) {
  return typeof value === "number" ? `${Math.round(value)}°` : "--";
}

function formatNumber(value?: number | null, suffix = "") {
  return typeof value === "number" ? `${Math.round(value)}${suffix}` : "--";
}

function formatPrecipitation(
  value: number | null | undefined,
  unitSystem: UnitSystem,
) {
  if (typeof value !== "number") {
    return "--";
  }

  return `${value}${unitSystem === "metric" ? " mm" : " in"}`;
}

function formatWind(value: number | null | undefined, unitSystem: UnitSystem) {
  if (typeof value !== "number") {
    return "--";
  }

  return `${Math.round(value)} ${unitSystem === "metric" ? "km/h" : "mph"}`;
}

function formatDateLabel(dateString?: string) {
  if (!dateString) {
    return "Weather unavailable";
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatDayLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(dateString),
  );
}

function formatHourLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  }).format(new Date(dateString));
}

function buildMetricCards(
  forecast: ForecastResponse,
  unitSystem: UnitSystem,
): MetricCard[] {
  const current = forecast.current ?? {};

  return [
    { label: "Feels Like", value: formatTemperature(current.apparent_temperature) },
    {
      label: "Humidity",
      value:
        typeof current.relative_humidity_2m === "number"
          ? `${Math.round(current.relative_humidity_2m)}%`
          : "--",
    },
    { label: "Wind", value: formatWind(current.wind_speed_10m, unitSystem) },
    {
      label: "Precipitation",
      value: formatPrecipitation(current.precipitation, unitSystem),
    },
  ];
}

function buildForecastDays(forecast: ForecastResponse): ForecastDay[] {
  const times = forecast.daily?.time ?? [];
  const codes = forecast.daily?.weather_code ?? [];
  const highs = forecast.daily?.temperature_2m_max ?? [];
  const lows = forecast.daily?.temperature_2m_min ?? [];

  return times.map((time, index) => {
    const visual = getWeatherVisual(codes[index]);

    return {
      id: time,
      day: formatDayLabel(time),
      icon: visual.icon,
      condition: visual.label,
      high: typeof highs[index] === "number" ? Math.round(highs[index] as number) : 0,
      low: typeof lows[index] === "number" ? Math.round(lows[index] as number) : 0,
    };
  });
}

function buildHourlyByDay(forecast: ForecastResponse): Record<string, HourlyEntry[]> {
  const times = forecast.hourly?.time ?? [];
  const temperatures = forecast.hourly?.temperature_2m ?? [];
  const codes = forecast.hourly?.weather_code ?? [];

  return times.reduce<Record<string, HourlyEntry[]>>((accumulator, time, index) => {
    const dayId = time.slice(0, 10);
    const visual = getWeatherVisual(codes[index]);
    const entry: HourlyEntry = {
      time: formatHourLabel(time),
      icon: visual.icon,
      condition: visual.label,
      temperature:
        typeof temperatures[index] === "number"
          ? Math.round(temperatures[index] as number)
          : null,
    };

    accumulator[dayId] ??= [];
    accumulator[dayId].push(entry);
    return accumulator;
  }, {});
}

export function toWeatherViewModel(
  location: LocationResult,
  forecast: ForecastResponse,
  unitSystem: UnitSystem,
): WeatherViewModel {
  const forecastDays = buildForecastDays(forecast);
  const hourlyByDay = buildHourlyByDay(forecast);
  const selectedDayId = forecastDays[0]?.id ?? "";
  const currentVisual = getWeatherVisual(forecast.current?.weather_code);

  return {
    locationQuery: `${location.name}, ${location.country}`,
    selectedDayId,
    currentCard: {
      city: `${location.name}, ${location.country}`,
      dateLabel: formatDateLabel(
        forecast.current?.time ?? forecast.daily?.time?.[0] ?? undefined,
      ),
      icon: currentVisual.icon,
      temperature: formatTemperature(forecast.current?.temperature_2m),
    },
    metricCards: buildMetricCards(forecast, unitSystem),
    forecastDays,
    hourlyByDay,
  };
}
