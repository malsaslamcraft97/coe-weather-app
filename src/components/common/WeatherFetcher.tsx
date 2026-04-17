import { useEffect, useState, useRef, useCallback } from "react";
import { fetchWeather, type WeatherViewModel } from "../../data/weather";

type WeatherState = {
  data: WeatherViewModel | null;
  loading: boolean;
  error: Error | null;
};

type WeatherFetcherProps = {
  city: string;
  children: (state: WeatherState & { refetch: () => void }) => React.ReactNode;
};

export function WeatherFetcher({ city, children }: WeatherFetcherProps) {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // cancel previous request
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const data = await fetchWeather(city, {
        signal: controller.signal,
      });

      // ignore if aborted
      if (controller.signal.aborted) return;

      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (err) {
      if (controller.signal.aborted) return;

      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err : new Error("Unknown error"),
      });
    }
  }, [city]);

  useEffect(() => {
    fetchData();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return <>{children({ ...state, refetch: fetchData })}</>;
}
