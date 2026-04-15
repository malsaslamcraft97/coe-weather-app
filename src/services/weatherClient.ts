import type { UnitSystem } from "../data/weather";

export type LocationResult = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type ForecastResponse = {
  current?: {
    time?: string;
    temperature_2m?: number | null;
    apparent_temperature?: number | null;
    relative_humidity_2m?: number | null;
    precipitation?: number | null;
    weather_code?: number | null;
    wind_speed_10m?: number | null;
  } | null;
  hourly?: {
    time?: string[];
    temperature_2m?: Array<number | null>;
    weather_code?: Array<number | null>;
  } | null;
  daily?: {
    time?: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
  } | null;
};

export async function searchLocation(query: string) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query,
    )}&count=10&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error("We couldn't connect to the server (API error).");
  }

  const json = (await response.json()) as { results?: LocationResult[] };
  return json.results ?? [];
}

export async function fetchForecast(
  location: LocationResult,
  unitSystem: UnitSystem,
) {
  const temperatureUnit =
    unitSystem === "metric" ? "celsius" : "fahrenheit";
  const windSpeedUnit = unitSystem === "metric" ? "kmh" : "mph";
  const precipitationUnit = unitSystem === "metric" ? "mm" : "inch";

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`,
  );

  if (!response.ok) {
    throw new Error("We couldn't connect to the server (API error).");
  }

  return (await response.json()) as ForecastResponse;
}
