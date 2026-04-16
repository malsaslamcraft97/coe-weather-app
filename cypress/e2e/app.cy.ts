describe("Weather app (authenticated)", () => {
  beforeEach(() => {
    // Mock APIs
    cy.intercept("GET", "**/v1/search*", {
      statusCode: 200,
      body: {
        results: [
          {
            id: 2950159,
            name: "Berlin",
            country: "Germany",
            latitude: 52.52437,
            longitude: 13.41053,
          },
        ],
      },
    }).as("searchLocation");

    cy.intercept("GET", "**/v1/forecast*", (req) => {
      const url = new URL(req.url);
      const isImperial =
        url.searchParams.get("temperature_unit") === "fahrenheit";

      req.reply({
        statusCode: 200,
        body: {
          current: {
            time: "2025-08-05T15:00",
            temperature_2m: isImperial ? 68 : 20,
            apparent_temperature: isImperial ? 64 : 18,
            relative_humidity_2m: 46,
            precipitation: 0,
            weather_code: 0,
            wind_speed_10m: isImperial ? 9 : 14,
          },
          hourly: {
            time: ["2025-08-05T15:00", "2025-08-05T16:00"],
            temperature_2m: isImperial ? [68, 66] : [20, 19],
            weather_code: [0, 3],
          },
          daily: {
            time: ["2025-08-05", "2025-08-06"],
            weather_code: [0, 63],
            temperature_2m_max: isImperial ? [68, 70] : [20, 21],
            temperature_2m_min: isImperial ? [57, 59] : [14, 15],
          },
        },
      });
    }).as("fetchForecast");

    // Mock login API
    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    // Visit app
    cy.visit("/", { timeout: 30000 });

    // ✅ IMPORTANT: Fill form (otherwise login won't fire)
    cy.get('[data-testid="email-input"]').type("test@test.com");
    cy.get('[data-testid="password-input"]').type("123456");

    cy.get('[data-testid="login-button"]').click();

    // ✅ Wait for login request
    cy.wait("@login");
  });

  it("renders API-backed weather data on first load", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.contains("Berlin, Germany").should("be.visible");
    cy.contains("20°").should("be.visible");
    cy.contains("Feels Like").should("be.visible");
    cy.contains("Hourly forecast").should("be.visible");
  });

  it("searches again when the user submits a new location", () => {
    cy.intercept(
      "GET",
      "https://geocoding-api.open-meteo.com/v1/search*name=Tokyo*",
      {
        statusCode: 200,
        body: {
          results: [
            {
              id: 1850147,
              name: "Tokyo",
              country: "Japan",
              latitude: 35.6895,
              longitude: 139.69171,
            },
          ],
        },
      },
    ).as("searchTokyo");

    cy.intercept(
      "GET",
      "https://api.open-meteo.com/v1/forecast*latitude=35.6895*",
      {
        statusCode: 200,
        body: {
          current: {
            time: "2025-08-06T15:00",
            temperature_2m: 27,
            apparent_temperature: 29,
            relative_humidity_2m: 74,
            precipitation: 2,
            weather_code: 3,
            wind_speed_10m: 9,
          },
          hourly: {
            time: ["2025-08-06T15:00", "2025-08-06T16:00"],
            temperature_2m: [27, 26],
            weather_code: [3, 61],
          },
          daily: {
            time: ["2025-08-06", "2025-08-07"],
            weather_code: [3, 61],
            temperature_2m_max: [29, 28],
            temperature_2m_min: [24, 23],
          },
        },
      },
    ).as("fetchTokyoForecast");

    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.get('input[type="search"]').clear().type("Tokyo");
    cy.contains("button", "Search").click();

    cy.wait("@searchTokyo");
    cy.wait("@fetchTokyoForecast");

    cy.contains("Tokyo, Japan").should("be.visible");
    cy.contains("27°").should("be.visible");
  });

  it("displays additional weather metrics", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.contains("Feels Like").should("be.visible");
    cy.contains("Humidity").should("be.visible");
    cy.contains("Wind").should("be.visible");
    cy.contains("Precipitation").should("be.visible");

    cy.contains("18°").should("be.visible");
    cy.contains("46").should("be.visible");
    cy.contains("14").should("be.visible");
    cy.contains("0").should("be.visible");
  });

  it("toggles temperature units from Celsius to Fahrenheit", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.contains("20°").should("be.visible");

    cy.get('[data-testid="units-toggle"]').click();
    cy.get('[data-testid="units-dropdown"]').should("be.visible");

    cy.contains("Fahrenheit").click();

    cy.wait("@fetchForecast");

    cy.contains("68°").should("be.visible");
  });

  it("opens units dropdown and selects Fahrenheit", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.contains("Fahrenheit").should("not.exist");

    cy.get('[data-testid="units-toggle"]').click();
    cy.get('[data-testid="units-dropdown"]').should("be.visible");

    cy.contains("Celsius").should("be.visible");
    cy.contains("Fahrenheit").should("be.visible");

    cy.contains("Fahrenheit").click();

    cy.wait("@fetchForecast");

    cy.contains("68°").should("be.visible");
  });
});

describe("Auth flow", () => {
  it("shows login screen before authentication", () => {
    cy.visit("/");

    cy.contains("Login").should("be.visible");
    cy.contains("Hourly forecast").should("not.exist");
  });

  it("logs in successfully and shows weather app", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    cy.visit("/");

    // ✅ MUST fill form
    cy.get('[data-testid="email-input"]').type("test@test.com");
    cy.get('[data-testid="password-input"]').type("123456");

    cy.get('[data-testid="login-button"]').click();
    cy.wait("@login");

    cy.contains("Hourly forecast").should("be.visible");
  });

  it("navigates from login screen to dashboard after login", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    cy.visit("/");

    // ✅ login first
    cy.get('[data-testid="email-input"]').type("test@test.com");
    cy.get('[data-testid="password-input"]').type("123456");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@login");

    cy.contains("Hourly forecast").should("be.visible");
  });

  it("logs out and navigates back to login screen", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    cy.visit("/");

    // Login first
    cy.get('[data-testid="email-input"]').type("test@test.com");
    cy.get('[data-testid="password-input"]').type("123456");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@login");

    cy.contains("Hourly forecast").should("be.visible");

    // ❌ This will fail (no logout yet)
    cy.get('[data-testid="logout-button"]').click();

    // Expect navigation back to login
    cy.contains("Login").should("be.visible");
    cy.contains("Hourly forecast").should("not.exist");
  });
});
