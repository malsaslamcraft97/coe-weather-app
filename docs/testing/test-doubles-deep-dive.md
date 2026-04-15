# Test Doubles Deep Dive

This project is moving toward a component + `useX.ts` structure, so our testing approach should follow the same separation:

- UI files (`Component.tsx`) should be tested mostly through rendered behavior.
- data/hook files (`useX.ts`) should be tested through controlled inputs and outputs.
- network and side-effect boundaries should be replaced with test doubles so we can cover edge cases deterministically.

## What we mean by test doubles

Test doubles are stand-ins for real collaborators used during testing.

- `Stub`: returns predefined data so a test can force a component or hook into a specific state.
- `Mock`: a pre-programmed replacement that also encodes expectations about how it should be used.
- `Fake`: a lightweight working implementation that behaves like the real thing, but is simpler and safer for tests.
- `Spy`: records how a function was called so we can assert interactions after the fact.

In practice, teams sometimes use "mock" as an umbrella term, but we will keep the terms distinct because each solves a different problem.

## How we are doing this in this app

We are organizing test doubles around the same layers as the app:

1. `src/data/*`
   Use fakes and stubs here to control weather payloads, forecast lists, and unit-specific values.

2. `src/useApp.ts` and `src/components/**/useX.ts`
   Use stubs for returned state and spies for callbacks like day selection, search submit, and unit changes.

3. `src/components/**/*.tsx`
   Test rendered output with stubbed props. These components should not need real API calls or real browser integrations to verify behavior.

4. Future API client layer
   Use fakes for happy-path integration-style tests and mocks/stubs for failure-path tests.

This means we do not want every component test to know about Open-Meteo directly. Instead, we isolate the API dependency behind a small boundary and double that boundary in tests.

## Why this matters

The weather app has many UI states and asynchronous edges:

- location search
- loading
- success
- no results
- API failure
- unit changes
- hourly/day switching
- partial or malformed data

If tests depend on real network traffic, current time, or unpredictable API responses, they become flaky. Test doubles let us force each case intentionally and verify that the UI responds correctly.

## Recommended doubles by scenario

### 1. Search flow

Use:

- `Spy` for `onSubmit`
- `Spy` for `onQueryChange`
- `Stub` for initial input value

What we verify:

- search input reflects the provided query
- submit handler is called
- typing triggers the change callback
- empty or whitespace query is handled intentionally

### 2. Units menu

Use:

- `Stub` for current unit system
- `Spy` for `onToggleUnits`
- `Spy` for `onSelectUnit`

What we verify:

- the selected option is visually marked
- menu opens/closes correctly
- choosing `metric` or `imperial` calls the correct callback
- menu state does not leak between tests

### 3. Current weather card

Use:

- `Stub` for temperature
- `Fake` or `Stub` for weather display data if this moves behind a selector/helper

What we verify:

- city, date, icon, and temperature render correctly
- fallback behavior exists if icon or background data is missing

### 4. Weather metrics

Use:

- `Stub` metric arrays

What we verify:

- all cards render in order
- values update correctly when units change
- empty metrics state is either prevented or rendered gracefully

### 5. Daily forecast

Use:

- `Stub` forecast days
- `Spy` for `onSelectDay`

What we verify:

- selected day styling is correct
- clicking a day calls the callback with the correct id
- duplicate or malformed day data is handled safely if introduced upstream

### 6. Hourly forecast

Use:

- `Stub` hourly list data
- `Stub` selected day label

What we verify:

- hourly rows render correctly
- empty hourly arrays render an intentional empty state
- long condition labels do not break the layout
- missing temperatures/icons are handled safely

## Edge cases we should explicitly cover

These are the edge cases worth modeling with doubles first:

- empty search query
- whitespace-only search query
- extremely long search query
- no matching location results
- loading state that lasts longer than expected
- API error response
- network timeout / rejected promise
- partial weather payload
- missing hourly array
- missing daily array
- unsupported weather code
- unit switch while data is loading
- day switch when hourly data for that day is empty
- duplicate day ids
- null/undefined values after transformation

## The fake data strategy

Right now, `src/data/weatherMock.ts` is already acting like a seed fake for UI development. That is useful, but for tests we should evolve this into smaller, targeted fixtures instead of one giant default object.

Recommended pattern:

- `makeForecastDay(overrides)`
- `makeHourlyEntry(overrides)`
- `makeWeatherMetrics(overrides)`
- `makeWeatherResponse(overrides)`

Each factory should return valid defaults and let a test override only the field it cares about. This keeps tests focused and readable.

Example idea:

```ts
const day = makeForecastDay({ id: "fri", high: 31, low: 22 });
```

This is better than copying a full object into every test.

## When to use each double

Choose the lightest double that proves the behavior:

- Use a `stub` when you only need controlled input data.
- Use a `spy` when you only care whether a callback was called and with what.
- Use a `fake` when you need lightweight behavior across several tests.
- Use a `mock` only when interaction expectations are the main point of the test.

We should prefer stubs and spies most of the time. Overusing mocks makes tests rigid and overly coupled to implementation details.

## What “good” looks like for this codebase

A good test in this app:

- names a user-facing behavior
- uses the smallest necessary double
- does not depend on the real Open-Meteo API
- does not depend on unrelated component internals
- fails for a meaningful regression

Examples:

- "renders metric values in imperial units when `unitSystem` is imperial"
- "calls `onSelectDay` with `fri` when Friday is clicked"
- "shows empty hourly state when no hourly entries exist"
- "keeps the selected unit highlighted in the units menu"

## Suggested next implementation step

Before writing many tests, add a real testing stack and a thin API boundary:

1. Add `Vitest` and `React Testing Library`
2. Introduce a dedicated weather client module
3. Move data transformation into pure functions
4. Add fixture factories for weather data
5. Start with component tests that use stubs and spies

That sequence gives us stable, maintainable tests instead of brittle snapshots or network-heavy test suites.

## Phase note

Current phase separation in this repo:

- `RED`: app-level API integration expectations live in `src/App.api.test.tsx`
- `GREEN`: the MSW scenario layer is fully set up and verified in `src/test/msw/scenarios.test.ts`
- `REFACTOR`: wire the real app flow to a weather client and then re-enable the app-level API tests

This keeps our mocks trustworthy now without pretending the UI already performs live API integration.
