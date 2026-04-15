import { http, HttpResponse } from "msw";
import {
  makeForecastResponse,
  makeGeocodingResponse,
  makeGeocodingResult,
} from "./factories";

export const defaultHandlers = [
  http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
    HttpResponse.json(makeGeocodingResponse([makeGeocodingResult()])),
  ),
  http.get("https://api.open-meteo.com/v1/forecast", () =>
    HttpResponse.json(makeForecastResponse()),
  ),
];
