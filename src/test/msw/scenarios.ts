import { http, HttpResponse } from "msw";
import { server } from "./server";

export function mockWeatherSuccess() {
  server.use(
    http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
      HttpResponse.json({
        results: [
          {
            id: 1850147,
            name: "Tokyo",
            country: "Japan",
            latitude: 35.6895,
            longitude: 139.69171,
          },
        ],
      }),
    ),
    http.get("https://api.open-meteo.com/v1/forecast", () =>
      HttpResponse.json({
        current: {
          temperature_2m: 27,
          apparent_temperature: 29,
          relative_humidity_2m: 74,
          wind_speed_10m: 9,
          precipitation: 2,
        },
        hourly: {
          time: ["2025-08-06T15:00", "2025-08-06T16:00"],
          temperature_2m: [27, 26],
          weather_code: [3, 61],
        },
        daily: {
          time: ["2025-08-06", "2025-08-07"],
          weather_code: [3, 61],
          temperature_2m_max: [29, 28],
          temperature_2m_min: [24, 23],
        },
      }),
    ),
  );
}

export function mockWeatherNoResults() {
  server.use(
    http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
      HttpResponse.json({ results: [] }),
    ),
  );
}

export function mockWeatherApiError() {
  server.use(
    http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
      HttpResponse.json(
        {
          results: [
            {
              id: 2950159,
              name: "Berlin",
              country: "Germany",
              latitude: 52.52437,
              longitude: 13.41053,
            },
          ],
        },
      ),
    ),
    http.get("https://api.open-meteo.com/v1/forecast", () =>
      HttpResponse.json(
        {
          error: true,
          reason: "Temporary backend issue",
        },
        { status: 500 },
      ),
    ),
  );
}
