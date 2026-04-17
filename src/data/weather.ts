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

type FetchWeatherOptions = {
  signal?: AbortSignal;
};

function createMockWeatherViewModel(query: string): WeatherViewModel {
  const days: ForecastDay[] = [
    {
      id: "day-1",
      day: "Today",
      icon: "/icons/sunny.svg",
      condition: "Sunny",
      high: 30,
      low: 22,
    },
    {
      id: "day-2",
      day: "Tomorrow",
      icon: "/icons/cloudy.svg",
      condition: "Cloudy",
      high: 28,
      low: 21,
    },
  ];

  const hourlyByDay: Record<string, HourlyEntry[]> = {
    "day-1": Array.from({ length: 8 }, (_, i) => ({
      time: `${i + 1} PM`,
      icon: "/icons/sunny.svg",
      condition: "Sunny",
      temperature: 25 + i,
    })),
    "day-2": Array.from({ length: 8 }, (_, i) => ({
      time: `${i + 1} PM`,
      icon: "/icons/cloudy.svg",
      condition: "Cloudy",
      temperature: 23 + i,
    })),
  };

  return {
    locationQuery: query,
    selectedDayId: days[0].id,

    currentCard: {
      city: query,
      dateLabel: "Today",
      icon: "/icons/sunny.svg",
      temperature: "30°",
    },

    metricCards: [
      { label: "Humidity", value: "60%" },
      { label: "Wind", value: "12 km/h" },
    ],

    forecastDays: days,
    hourlyByDay,
  };
}

/**
 * Central data fetcher returning full ViewModel
 */
export async function fetchWeather(
  query: string,
  options?: FetchWeatherOptions,
): Promise<WeatherViewModel> {
  const { signal } = options || {};

  // simulate network delay
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 800);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  // 👉 Replace with real API later
  return createMockWeatherViewModel(query);
}
