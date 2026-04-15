import { delay, http, HttpResponse } from "msw";
import { server } from "./server";
import {
  makeForecastResponse,
  makeGeocodingResponse,
  makeGeocodingResult,
} from "./factories";

const geocodingUrl = "https://geocoding-api.open-meteo.com/v1/search";
const forecastUrl = "https://api.open-meteo.com/v1/forecast";

export function mockWeatherSuccess() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(
        makeGeocodingResponse([
          makeGeocodingResult({
            id: 1850147,
            name: "Tokyo",
            country: "Japan",
            latitude: 35.6895,
            longitude: 139.69171,
          }),
        ]),
      ),
    ),
    http.get(forecastUrl, () =>
      HttpResponse.json(
        makeForecastResponse({
          current: {
            time: "2025-08-06T15:00",
            temperature_2m: 27,
            apparent_temperature: 29,
            relative_humidity_2m: 74,
            wind_speed_10m: 9,
            precipitation: 2,
            weather_code: 3,
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
    ),
  );
}

export function mockWeatherNoResults() {
  server.use(
    http.get(geocodingUrl, () => HttpResponse.json(makeGeocodingResponse([]))),
  );
}

export function mockWeatherApiError() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () =>
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

export function mockGeocodingApiError() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(
        {
          error: true,
          reason: "Geocoding unavailable",
        },
        { status: 503 },
      ),
    ),
  );
}

export function mockWeatherNetworkError() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () => HttpResponse.error()),
  );
}

export function mockWeatherLoadingDelay(delayMs = 150) {
  server.use(
    http.get(geocodingUrl, async () => {
      await delay(delayMs);
      return HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()]));
    }),
    http.get(forecastUrl, async () => {
      await delay(delayMs);
      return HttpResponse.json(makeForecastResponse());
    }),
  );
}

export function mockWeatherPartialForecast() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () =>
      HttpResponse.json(
        makeForecastResponse({
          current: {
            time: "2025-08-05T15:00",
            temperature_2m: 20,
          },
          hourly: null,
        }),
      ),
    ),
  );
}

export function mockWeatherEmptyHourly() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () =>
      HttpResponse.json(
        makeForecastResponse({
          hourly: {
            time: [],
            temperature_2m: [],
            weather_code: [],
          },
        }),
      ),
    ),
  );
}

export function mockWeatherEmptyDaily() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () =>
      HttpResponse.json(
        makeForecastResponse({
          daily: {
            time: [],
            weather_code: [],
            temperature_2m_max: [],
            temperature_2m_min: [],
          },
        }),
      ),
    ),
  );
}

export function mockWeatherMalformedPayload() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () =>
      HttpResponse.json({
        current: null,
        hourly: "not-an-object",
        daily: {
          time: null,
        },
      }),
    ),
  );
}

export function mockWeatherUnsupportedWeatherCode() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
    ),
    http.get(forecastUrl, () =>
      HttpResponse.json(
        makeForecastResponse({
          hourly: {
            time: ["2025-08-05T15:00"],
            temperature_2m: [20],
            weather_code: [999],
          },
          daily: {
            time: ["2025-08-05"],
            weather_code: [999],
            temperature_2m_max: [20],
            temperature_2m_min: [14],
          },
        }),
      ),
    ),
  );
}

export function mockWeatherMultipleResults() {
  server.use(
    http.get(geocodingUrl, () =>
      HttpResponse.json(
        makeGeocodingResponse([
          makeGeocodingResult({ id: 5128581, name: "New York", country: "United States" }),
          makeGeocodingResult({ id: 2643743, name: "London", country: "United Kingdom" }),
        ]),
      ),
    ),
  );
}

export function mockWeatherSequentialSearches() {
  let geocodingRequestCount = 0;
  let forecastRequestCount = 0;

  const geocodingResponses = [
    makeGeocodingResponse([
      makeGeocodingResult({ id: 2950159, name: "Berlin", country: "Germany" }),
    ]),
    makeGeocodingResponse([
      makeGeocodingResult({ id: 5128581, name: "New York", country: "United States" }),
    ]),
  ];

  const forecastResponses = [
    makeForecastResponse({
      current: {
        time: "2025-08-05T15:00",
        temperature_2m: 20,
        apparent_temperature: 18,
        relative_humidity_2m: 46,
        wind_speed_10m: 14,
        precipitation: 0,
        weather_code: 0,
      },
    }),
    makeForecastResponse({
      current: {
        time: "2025-08-06T15:00",
        temperature_2m: 11,
        apparent_temperature: 8,
        relative_humidity_2m: 68,
        wind_speed_10m: 20,
        precipitation: 4,
        weather_code: 63,
      },
    }),
  ];

  server.use(
    http.get(geocodingUrl, () => {
      const response =
        geocodingResponses[geocodingRequestCount] ??
        geocodingResponses[geocodingResponses.length - 1];
      geocodingRequestCount += 1;
      return HttpResponse.json(response);
    }),
    http.get(forecastUrl, () => {
      const response =
        forecastResponses[forecastRequestCount] ??
        forecastResponses[forecastResponses.length - 1];
      forecastRequestCount += 1;
      return HttpResponse.json(response);
    }),
  );
}
