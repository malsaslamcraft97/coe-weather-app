import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { AppProvider } from "./context/AppProvider";
import {
  mockWeatherApiError,
  mockWeatherNoResults,
  mockWeatherSuccess,
} from "./test/msw/scenarios";

function renderApp() {
  return render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
}

describe("App API integration", () => {
  it("searches a new location and renders fresh weather data from the API", async () => {
    mockWeatherSuccess();
    const user = userEvent.setup();

    renderApp();

    const searchBox = screen.getByRole("searchbox", { name: /search location/i });
    await user.clear(searchBox);
    await user.type(searchBox, "Tokyo");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(await screen.findByText(/tokyo, japan/i)).toBeInTheDocument();
    expect((await screen.findAllByText("27°")).length).toBeGreaterThan(0);
  });

  it("shows a no-results state when geocoding returns no matches", async () => {
    mockWeatherNoResults();
    const user = userEvent.setup();

    renderApp();

    const searchBox = screen.getByRole("searchbox", { name: /search location/i });
    await user.clear(searchBox);
    await user.type(searchBox, "Atlantis");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(await screen.findByText(/no search result found!/i)).toBeInTheDocument();
  });

  it("shows an API error state when the forecast request fails", async () => {
    mockWeatherApiError();
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
