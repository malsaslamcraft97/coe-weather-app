describe("Weather app", () => {
  beforeEach(() => {
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

    cy.intercept("GET", "**/v1/forecast*", {
      statusCode: 200,
      body: {
        current: {
          time: "2025-08-05T15:00",
          temperature_2m: 20,
          apparent_temperature: 18,
          relative_humidity_2m: 46,
          precipitation: 0,
          weather_code: 0,
          wind_speed_10m: 14,
        },
        hourly: {
          time: ["2025-08-05T15:00", "2025-08-05T16:00"],
          temperature_2m: [20, 19],
          weather_code: [0, 3],
        },
        daily: {
          time: ["2025-08-05", "2025-08-06"],
          weather_code: [0, 63],
          temperature_2m_max: [20, 21],
          temperature_2m_min: [14, 15],
        },
      },
    }).as("fetchForecast");

    cy.visit("/", { timeout: 30000 });
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

    // Labels
    cy.contains("Feels Like").should("be.visible");
    cy.contains("Humidity").should("be.visible");
    cy.contains("Wind").should("be.visible");
    cy.contains("Precipitation").should("be.visible");

    // Values (use partial match for robustness)
    cy.contains("18°").should("be.visible");
    cy.contains("46").should("be.visible"); // humidity %
    cy.contains("14").should("be.visible"); // wind speed
    cy.contains("0").should("be.visible"); // precipitation
  });

  it("toggles temperature units from Celsius to Fahrenheit", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    // Default should be Celsius
    cy.contains("20°").should("be.visible");

    // Open units dropdown
    cy.contains("Units").click();

    // Select Fahrenheit
    cy.contains(/fahrenheit/i).click();

    // Verify temperature converted (20°C → 68°F)
    cy.contains("68°").should("be.visible");
  });

  it("opens units dropdown and selects Fahrenheit", () => {
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    // Initially dropdown options should NOT be visible
    cy.contains("Fahrenheit").should("not.exist");

    // Open dropdown
    cy.contains("Units").click();

    // Now options should appear
    cy.contains("Celsius").should("be.visible");
    cy.contains("Fahrenheit").should("be.visible");

    // Select Fahrenheit
    cy.contains("Fahrenheit").click();

    // Dropdown should close (optional but good)
    cy.contains("Fahrenheit").should("not.exist");

    // Temperature updated
    cy.contains("68°").should("be.visible");
  });
});
