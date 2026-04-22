// Helper to log accessibility violations without failing tests
function logA11y(context?: string) {
  cy.checkA11y(
    context,
    undefined,
    (violations) => {
      cy.task(
        "logA11y",
        violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((node) => ({
            target: node.target.join(" "),
            html: node.html,
            failureSummary: node.failureSummary,
          })),
        })),
      );
    },
    true, // don't fail tests
  );
}

describe("Weather app (authenticated)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

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

    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    cy.visit("/");
    cy.injectAxe();

    // Login flow
    cy.get('[data-testid="email-input"]', { timeout: 10000 })
      .should("be.visible")
      .type("test@test.com");

    cy.contains("button", "Continue").click();

    cy.get('[data-testid="password-input"]')
      .should("be.visible")
      .type("123456");

    logA11y(); // non-blocking

    cy.get('[data-testid="login-button"]').click();
    cy.wait("@login");
  });

  it("renders API-backed weather data on first load", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.contains("Berlin, Germany").should("be.visible");
    cy.contains("20°").should("be.visible");

    logA11y();
  });

  it("searches again when the user submits a new location", () => {
    cy.intercept("GET", "**/v1/search*Tokyo*", {
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
    }).as("searchTokyo");

    cy.intercept("GET", "**/v1/forecast*35.6895*", {
      statusCode: 200,
      body: {
        current: {
          time: "2025-08-06T15:00",
          temperature_2m: 27,
        },
      },
    }).as("fetchTokyoForecast");

    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.get('input[type="search"]').clear().type("Tokyo");
    cy.contains("button", "Search").click();

    cy.wait("@searchTokyo");
    cy.wait("@fetchTokyoForecast");

    cy.contains("Tokyo, Japan").should("be.visible");

    logA11y();
  });

  it("displays additional weather metrics", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.contains("Humidity").should("be.visible");
    cy.contains("Wind").should("be.visible");

    logA11y();
  });

  it("toggles temperature units from Celsius to Fahrenheit", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.get('[data-testid="units-toggle"]').click();
    cy.contains("Fahrenheit").click();

    cy.wait("@fetchForecast");
    cy.contains("68°").should("be.visible");

    logA11y();
  });

  it("opens units dropdown and selects Fahrenheit", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.get('[data-testid="units-toggle"]').click();
    cy.get('[data-testid="units-dropdown"]').should("be.visible");

    logA11y('[data-testid="units-dropdown"]'); // scoped

    cy.contains("Fahrenheit").click();

    cy.wait("@fetchForecast");
    cy.contains("68°").should("be.visible");

    logA11y();
  });
});

describe("Auth flow", () => {
  it("shows login screen before authentication", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.contains("Login").should("be.visible");

    logA11y();
  });

  it("logs in successfully and shows weather app", () => {
    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    cy.visit("/");
    cy.injectAxe();

    cy.get('[data-testid="email-input"]').type("test@test.com");
    cy.contains("button", "Continue").click();

    cy.get('[data-testid="password-input"]').type("123456");

    logA11y();

    cy.get('[data-testid="login-button"]').click();
    cy.wait("@login");

    cy.contains("Hourly forecast").should("be.visible");

    logA11y();
  });

  it("navigates from login screen to dashboard after login", () => {
    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
      body: { token: "fake-token" },
    }).as("login");

    cy.visit("/");
    cy.injectAxe();

    cy.get('[data-testid="email-input"]').type("test@test.com");
    cy.contains("button", "Continue").click();

    cy.get('[data-testid="password-input"]').type("123456");
    cy.get('[data-testid="login-button"]').click();

    cy.wait("@login");
    cy.contains("Hourly forecast").should("be.visible");

    logA11y();
  });
});
