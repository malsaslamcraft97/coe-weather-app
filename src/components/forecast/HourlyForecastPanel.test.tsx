import { render, screen } from "@testing-library/react";
import { HourlyForecastPanel } from "./HourlyForecastPanel";
import { makeHourlyEntry } from "../../test/test-doubles/weather";
import { AppContext } from "../../context/AppProvider";

const renderWithProvider = (ui: React.ReactNode) => {
  return render(
    <AppContext.Provider
      value={{
        state: {
          unitSystem: "metric",
        } as any,
        dispatch: vi.fn(),
        actions: {
          selectUnit: vi.fn(),
          searchWeather: vi.fn(),
          retrySearch: vi.fn(),
          login: vi.fn(),
        },
      }}
    >
      {ui}
    </AppContext.Provider>,
  );
};

describe("HourlyForecastPanel", () => {
  it("renders hourly entries with their conditions and temperatures", () => {
    renderWithProvider(
      <HourlyForecastPanel
        hourlyForecast={[
          makeHourlyEntry({
            time: "3 PM",
            condition: "Sunny with occasional cloud breaks",
            temperature: 20,
          }),
        ]}
        selectedDayLabel="Tue"
      />,
    );

    expect(
      screen.getByText(/sunny with occasional cloud breaks/i),
    ).toBeInTheDocument();

    expect(screen.getByText("20°")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /tue/i })).toBeInTheDocument();
  });

  it("shows an empty state when no hourly entries exist", () => {
    renderWithProvider(
      <HourlyForecastPanel hourlyForecast={[]} selectedDayLabel="Tue" />,
    );

    expect(
      screen.getByText(/no hourly forecast is available for this day yet/i),
    ).toBeInTheDocument();
  });

  it("renders a fallback temperature when the value is missing", () => {
    renderWithProvider(
      <HourlyForecastPanel
        hourlyForecast={[
          makeHourlyEntry({ time: "4 PM", temperature: undefined as never }),
        ]}
        selectedDayLabel="Wed"
      />,
    );

    expect(screen.getByText("--")).toBeInTheDocument();
  });
});
