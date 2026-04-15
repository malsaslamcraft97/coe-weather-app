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

    // fix for wantedly nested beforeEach error that was raised for RED test
    cy.visit("/", { timeout: 30000 });
  });

  it("renders API-backed weather data on first load", () => {
    cy.visit("/");

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

    cy.visit("/");
    cy.wait("@searchLocation");
    cy.wait("@fetchForecast");

    cy.get('input[type="search"]').clear().type("Tokyo");
    cy.contains("button", "Search").click();

    cy.wait("@searchTokyo");
    cy.wait("@fetchTokyoForecast");

    cy.contains("Tokyo, Japan").should("be.visible");
    cy.contains("27°").should("be.visible");
  });
});
