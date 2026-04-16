import { useState, type FormEvent } from "react";
import { useAppContext } from "./context/AppProvider";

export function useApp() {
  const { state, dispatch, actions } = useAppContext();
  const [unit, setUnit] = useState<"C" | "F">("C");

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await actions.searchWeather();
  };

  const forecastDays = state.weather?.forecastDays ?? [];
  const selectedDayId = state.selectedDayId || forecastDays[0]?.id || "";
  const selectedDayLabel =
    forecastDays.find((day) => day.id === selectedDayId)?.day ?? "Tue";

  const hourlyForecast = state.weather?.hourlyByDay?.[selectedDayId] ?? [];

  // ✅ IMPORTANT: use reducer directly (single source of truth)
  const logout = () => {
    dispatch({ type: "logout" });
  };

  return {
    query: state.query,
    status: state.status,
    unitSystem: state.unitSystem,
    isUnitsOpen: state.isUnitsOpen,
    weather: state.weather,
    forecastDays,
    selectedDay: selectedDayId,
    selectedDayLabel,
    hourlyForecast,
    errorMessage: state.errorMessage,

    setQuery: (value: string) => dispatch({ type: "setQuery", payload: value }),

    setSelectedDay: (value: string) =>
      dispatch({ type: "selectDay", payload: value }),

    toggleUnitsMenu: () => dispatch({ type: "toggleUnitsMenu" }),
    closeUnitsMenu: () => dispatch({ type: "closeUnitsMenu" }),

    selectUnit: actions.selectUnit,
    retrySearch: actions.retrySearch,
    handleSearchSubmit,

    unit,
    setUnit,

    logout, // ✅ clean + consistent
  };
}
