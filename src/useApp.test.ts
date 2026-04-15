import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useApp } from "./useApp";
import { AppProvider } from "./context/AppProvider";

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(AppProvider, null, children);
}

describe("useApp", () => {
  it("switches unit system through the context action", async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    await act(async () => {
      await result.current.selectUnit("imperial");
    });

    expect(result.current.unitSystem).toBe("imperial");
  });

  it("returns an empty hourly forecast when the selected day is unknown", async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    act(() => {
      result.current.setSelectedDay("unknown-day");
    });

    expect(result.current.hourlyForecast).toEqual([]);
    expect(result.current.selectedDayLabel).toBe("Tue");
  });
});
