type GeocodingResult = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type ForecastResponse = {
  current: {
    temperature_2m?: number | null;
    apparent_temperature?: number | null;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    precipitation?: number | null;
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

export function makeGeocodingResult(
  overrides: Partial<GeocodingResult> = {},
): GeocodingResult {
  return {
    id: 2950159,
    name: "Berlin",
    country: "Germany",
    latitude: 52.52437,
    longitude: 13.41053,
    ...overrides,
  };
}

export function makeGeocodingResponse(results = [makeGeocodingResult()]) {
  return { results };
}

export function makeForecastResponse(
  overrides: Partial<ForecastResponse> = {},
): ForecastResponse {
  return {
    current: {
      temperature_2m: 20,
      apparent_temperature: 18,
      relative_humidity_2m: 46,
      wind_speed_10m: 14,
      precipitation: 0,
    },
    hourly: {
      time: ["2025-08-05T15:00", "2025-08-05T16:00"],
      temperature_2m: [20, 19],
      weather_code: [1, 2],
    },
    daily: {
      time: ["2025-08-05", "2025-08-06"],
      weather_code: [51, 63],
      temperature_2m_max: [20, 21],
      temperature_2m_min: [14, 15],
    },
    ...overrides,
  };
}
