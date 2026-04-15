import { http, HttpResponse } from "msw";

export const defaultHandlers = [
  http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
    HttpResponse.json({
      results: [
        {
          id: 2950159,
          name: "Berlin",
          country: "Germany",
          latitude: 52.52437,
          longitude: 13.41053,
        },
      ],
    }),
  ),
  http.get("https://api.open-meteo.com/v1/forecast", () =>
    HttpResponse.json({
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
    }),
  ),
];
