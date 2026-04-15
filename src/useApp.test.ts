import { act, renderHook } from "@testing-library/react";
import { useApp } from "./useApp";

describe("useApp", () => {
  it("switches derived metric values when the unit system changes", () => {
    const { result } = renderHook(() => useApp());

    expect(result.current.metricCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Wind", value: "14 km/h" }),
      ]),
    );

    act(() => {
      result.current.setUnitSystem("imperial");
    });

    expect(result.current.currentTemperature).toBe("68°");
    expect(result.current.metricCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Wind", value: "9 mph" }),
      ]),
    );
  });

  it("returns an empty hourly forecast when the selected day is unknown", () => {
    const { result } = renderHook(() => useApp());

    act(() => {
      result.current.setSelectedDay("unknown-day");
    });

    expect(result.current.hourlyForecast).toEqual([]);
    expect(result.current.selectedDayLabel).toBe("Tue");
  });
});
