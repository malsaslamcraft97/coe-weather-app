import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { AppStatus, UnitSystem, WeatherViewModel } from "../data/weather";
import { fetchForecast, searchLocation } from "../services/weatherClient";
import { toWeatherViewModel } from "../services/weatherTransformers";

type AppState = {
  query: string;
  unitSystem: UnitSystem;
  isUnitsOpen: boolean;
  status: AppStatus;
  weather: WeatherViewModel | null;
  selectedDayId: string;
  lastSearchQuery: string;
  errorMessage: string;
};

type AppAction =
  | { type: "setQuery"; payload: string }
  | { type: "toggleUnitsMenu" }
  | { type: "closeUnitsMenu" }
  | { type: "setUnitSystem"; payload: UnitSystem }
  | { type: "selectDay"; payload: string }
  | { type: "fetchStart"; payload: { preserveData: boolean; query: string } }
  | { type: "fetchSuccess"; payload: WeatherViewModel }
  | { type: "fetchNoResults"; payload: string }
  | { type: "fetchError"; payload: string };

type AppContextValue = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  actions: {
    searchWeather: (queryOverride?: string) => Promise<void>;
    retrySearch: () => Promise<void>;
    selectUnit: (unit: UnitSystem) => Promise<void>;
  };
};

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  query: "Berlin",
  unitSystem: "metric",
  isUnitsOpen: false,
  status: "loading",
  weather: null,
  selectedDayId: "",
  lastSearchQuery: "Berlin",
  errorMessage: "",
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "setQuery":
      return { ...state, query: action.payload };
    case "toggleUnitsMenu":
      return { ...state, isUnitsOpen: !state.isUnitsOpen };
    case "closeUnitsMenu":
      return { ...state, isUnitsOpen: false };
    case "setUnitSystem":
      return { ...state, unitSystem: action.payload, isUnitsOpen: false };
    case "selectDay":
      return { ...state, selectedDayId: action.payload };
    case "fetchStart":
      return {
        ...state,
        status: action.payload.preserveData ? "searching" : "loading",
        lastSearchQuery: action.payload.query,
        errorMessage: "",
      };
    case "fetchSuccess":
      return {
        ...state,
        status: "ready",
        weather: action.payload,
        selectedDayId: action.payload.selectedDayId,
        query: action.payload.locationQuery,
        errorMessage: "",
      };
    case "fetchNoResults":
      return {
        ...state,
        status: "no-results",
        weather: null,
        errorMessage: "",
        lastSearchQuery: action.payload,
      };
    case "fetchError":
      return {
        ...state,
        status: "error",
        errorMessage: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const activeRequestRef = useRef(0);

  const searchWeather = async (queryOverride?: string) => {
    const nextQuery = (queryOverride ?? state.query).trim();

    if (!nextQuery) {
      dispatch({ type: "fetchNoResults", payload: nextQuery });
      return;
    }

    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    dispatch({
      type: "fetchStart",
      payload: { preserveData: Boolean(state.weather), query: nextQuery },
    });

    try {
      const locations = await searchLocation(nextQuery);

      if (activeRequestRef.current !== requestId) {
        return;
      }

      if (locations.length === 0) {
        dispatch({ type: "fetchNoResults", payload: nextQuery });
        return;
      }

      const forecast = await fetchForecast(locations[0], state.unitSystem);

      if (activeRequestRef.current !== requestId) {
        return;
      }

      const weather = toWeatherViewModel(
        locations[0],
        forecast,
        state.unitSystem,
      );

      dispatch({ type: "fetchSuccess", payload: weather });
    } catch {
      if (activeRequestRef.current !== requestId) {
        return;
      }

      dispatch({
        type: "fetchError",
        payload:
          "We couldn’t connect to the server (API error). Please try again in a few moments.",
      });
    }
  };

  const retrySearch = async () => {
    await searchWeather(state.lastSearchQuery || state.query);
  };

  const selectUnit = async (unit: UnitSystem) => {
    dispatch({ type: "setUnitSystem", payload: unit });

    const query = state.weather?.locationQuery || state.lastSearchQuery || state.query;
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    dispatch({
      type: "fetchStart",
      payload: { preserveData: Boolean(state.weather), query },
    });

    try {
      const locations = await searchLocation(query);

      if (activeRequestRef.current !== requestId) {
        return;
      }

      if (locations.length === 0) {
        dispatch({ type: "fetchNoResults", payload: query });
        return;
      }

      const forecast = await fetchForecast(locations[0], unit);

      if (activeRequestRef.current !== requestId) {
        return;
      }

      const weather = toWeatherViewModel(locations[0], forecast, unit);
      dispatch({ type: "fetchSuccess", payload: weather });
    } catch {
      if (activeRequestRef.current !== requestId) {
        return;
      }

      dispatch({
        type: "fetchError",
        payload:
          "We couldn’t connect to the server (API error). Please try again in a few moments.",
      });
    }
  };

  useEffect(() => {
    void searchWeather(initialState.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        actions: { searchWeather, retrySearch, selectUnit },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
