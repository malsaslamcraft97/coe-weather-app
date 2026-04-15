import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyForecast } from "./DailyForecast";
import { makeForecastDay } from "../../test/test-doubles/weather";

describe("DailyForecast", () => {
  it("calls onSelectDay with the chosen day id", async () => {
    const user = userEvent.setup();
    const onSelectDay = vi.fn();

    render(
      <DailyForecast
        forecastDays={[
          makeForecastDay({ id: "tue", day: "Tue" }),
          makeForecastDay({ id: "fri", day: "Fri", high: 25, low: 13 }),
        ]}
        selectedDay="tue"
        onSelectDay={onSelectDay}
      />,
    );

    await user.click(screen.getByRole("button", { name: /fri/i }));

    expect(onSelectDay).toHaveBeenCalledWith("fri");
  });

  it("marks the selected day with the active data attribute", () => {
    render(
      <DailyForecast
        forecastDays={[
          makeForecastDay({ id: "tue", day: "Tue" }),
          makeForecastDay({ id: "wed", day: "Wed" }),
        ]}
        selectedDay="wed"
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /wed/i })).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("shows an empty state when no forecast days are available", () => {
    render(
      <DailyForecast
        forecastDays={[]}
        selectedDay="tue"
        onSelectDay={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/forecast data is unavailable right now/i),
    ).toBeInTheDocument();
  });
});
