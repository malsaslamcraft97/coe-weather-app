import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {
  mockWeatherApiError,
  mockWeatherNoResults,
  mockWeatherSuccess,
} from "./test/msw/scenarios";

describe.skip("App API integration (REFACTOR phase)", () => {
  it("searches a new location and renders fresh weather data from the API", async () => {
    mockWeatherSuccess();
    const user = userEvent.setup();

    render(<App />);

    const searchBox = screen.getByRole("searchbox", { name: /search location/i });
    await user.clear(searchBox);
    await user.type(searchBox, "Tokyo");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(await screen.findByText(/tokyo, japan/i)).toBeInTheDocument();
    expect(await screen.findByText("27°")).toBeInTheDocument();
  });

  it("shows a no-results state when geocoding returns no matches", async () => {
    mockWeatherNoResults();
    const user = userEvent.setup();

    render(<App />);

    const searchBox = screen.getByRole("searchbox", { name: /search location/i });
    await user.clear(searchBox);
    await user.type(searchBox, "Atlantis");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(
      await screen.findByText(/no matching locations were found/i),
    ).toBeInTheDocument();
  });

  it("shows an API error state when the forecast request fails", async () => {
    mockWeatherApiError();
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(
      await screen.findByText(/unable to load weather data right now/i),
    ).toBeInTheDocument();
  });
});
