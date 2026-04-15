import { render, screen } from "@testing-library/react";
import { WeatherMetrics } from "./WeatherMetrics";
import { makeMetricCard } from "../../test/test-doubles/weather";

describe("WeatherMetrics", () => {
  it("renders metric cards in the provided order", () => {
    render(
      <WeatherMetrics
        metricCards={[
          makeMetricCard({ label: "Feels Like", value: "18°" }),
          makeMetricCard({ label: "Wind", value: "14 km/h" }),
          makeMetricCard({ label: "Precipitation", value: "0 mm" }),
        ]}
      />,
    );

    const labels = screen.getAllByText(/Feels Like|Wind|Precipitation/);

    expect(labels.map((node) => node.textContent)).toEqual([
      "Feels Like",
      "Wind",
      "Precipitation",
    ]);
  });

  it("shows an empty state when no metrics are available", () => {
    render(<WeatherMetrics metricCards={[]} />);

    expect(
      screen.getByText(/weather metrics are unavailable right now/i),
    ).toBeInTheDocument();
  });
});
