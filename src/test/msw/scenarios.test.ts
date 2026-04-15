import {
  mockGeocodingApiError,
  mockWeatherApiError,
  mockWeatherEmptyDaily,
  mockWeatherEmptyHourly,
  mockWeatherLoadingDelay,
  mockWeatherMalformedPayload,
  mockWeatherMultipleResults,
  mockWeatherNetworkError,
  mockWeatherNoResults,
  mockWeatherPartialForecast,
  mockWeatherSequentialSearches,
  mockWeatherSuccess,
  mockWeatherUnsupportedWeatherCode,
} from "./scenarios";

const geocodingUrl = "https://geocoding-api.open-meteo.com/v1/search?name=test";
const forecastUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41";

async function fetchJson(url: string) {
  const response = await fetch(url);
  const json = await response.json();

  return { response, json };
}

describe("MSW weather scenarios", () => {
  it("returns success payloads for geocoding and forecast", async () => {
    mockWeatherSuccess();

    const geocoding = await fetchJson(geocodingUrl);
    const forecast = await fetchJson(forecastUrl);

    expect(geocoding.response.ok).toBe(true);
    expect(geocoding.json.results[0].name).toBe("Tokyo");
    expect(forecast.response.ok).toBe(true);
    expect(forecast.json.current.temperature_2m).toBe(27);
  });

  it("returns an empty results array for no-results searches", async () => {
    mockWeatherNoResults();

    const { json } = await fetchJson(geocodingUrl);

    expect(json.results).toEqual([]);
  });

  it("returns a forecast API error response", async () => {
    mockWeatherApiError();

    const { response, json } = await fetchJson(forecastUrl);

    expect(response.status).toBe(500);
    expect(json.reason).toMatch(/temporary backend issue/i);
  });

  it("returns a geocoding API error response", async () => {
    mockGeocodingApiError();

    const { response, json } = await fetchJson(geocodingUrl);

    expect(response.status).toBe(503);
    expect(json.reason).toMatch(/geocoding unavailable/i);
  });

  it("simulates a network-level forecast failure", async () => {
    mockWeatherNetworkError();

    await expect(fetch(forecastUrl)).rejects.toThrow();
  });

  it("simulates delayed responses for loading states", async () => {
    mockWeatherLoadingDelay(120);

    const start = Date.now();
    const { response } = await fetchJson(geocodingUrl);
    const elapsed = Date.now() - start;

    expect(response.ok).toBe(true);
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  it("returns partial forecast payloads", async () => {
    mockWeatherPartialForecast();

    const { json } = await fetchJson(forecastUrl);

    expect(json.current.temperature_2m).toBe(20);
    expect(json.hourly).toBeNull();
  });

  it("returns empty hourly data", async () => {
    mockWeatherEmptyHourly();

    const { json } = await fetchJson(forecastUrl);

    expect(json.hourly.time).toEqual([]);
    expect(json.hourly.temperature_2m).toEqual([]);
  });

  it("returns empty daily data", async () => {
    mockWeatherEmptyDaily();

    const { json } = await fetchJson(forecastUrl);

    expect(json.daily.time).toEqual([]);
    expect(json.daily.temperature_2m_max).toEqual([]);
  });

  it("returns malformed payloads for defensive parsing tests", async () => {
    mockWeatherMalformedPayload();

    const { json } = await fetchJson(forecastUrl);

    expect(json.current).toBeNull();
    expect(json.hourly).toBe("not-an-object");
    expect(json.daily.time).toBeNull();
  });

  it("returns unsupported weather codes unchanged", async () => {
    mockWeatherUnsupportedWeatherCode();

    const { json } = await fetchJson(forecastUrl);

    expect(json.hourly.weather_code[0]).toBe(999);
    expect(json.daily.weather_code[0]).toBe(999);
  });

  it("returns multiple geocoding matches", async () => {
    mockWeatherMultipleResults();

    const { json } = await fetchJson(geocodingUrl);

    expect(json.results).toHaveLength(2);
    expect(json.results[0].name).toBe("New York");
    expect(json.results[1].name).toBe("London");
  });

  it("returns distinct responses across sequential searches", async () => {
    mockWeatherSequentialSearches();

    const firstGeo = await fetchJson(geocodingUrl);
    const secondGeo = await fetchJson(geocodingUrl);
    const firstForecast = await fetchJson(forecastUrl);
    const secondForecast = await fetchJson(forecastUrl);

    expect(firstGeo.json.results[0].name).toBe("Berlin");
    expect(secondGeo.json.results[0].name).toBe("New York");
    expect(firstForecast.json.current.temperature_2m).toBe(20);
    expect(secondForecast.json.current.temperature_2m).toBe(11);
  });
});
