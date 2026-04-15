import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("calls the toggle handler when the units button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleUnits = vi.fn();

    render(
      <AppHeader
        isUnitsOpen={false}
        unitSystem="metric"
        onToggleUnits={onToggleUnits}
        onSelectUnit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /units/i }));

    expect(onToggleUnits).toHaveBeenCalledTimes(1);
  });

  it("calls the select handler with imperial when that option is chosen", async () => {
    const user = userEvent.setup();
    const onSelectUnit = vi.fn();

    render(
      <AppHeader
        isUnitsOpen
        unitSystem="metric"
        onToggleUnits={vi.fn()}
        onSelectUnit={onSelectUnit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /imperial/i }));

    expect(onSelectUnit).toHaveBeenCalledWith("imperial");
  });

  it("shows a single selected unit in the open menu", () => {
    render(
      <AppHeader
        isUnitsOpen
        unitSystem="imperial"
        onToggleUnits={vi.fn()}
        onSelectUnit={vi.fn()}
      />,
    );

    const imperialButton = screen.getByRole("button", { name: /imperial/i });
    const metricButton = screen.getByRole("button", { name: /metric/i });

    expect(imperialButton.querySelector("img")).not.toBeNull();
    expect(metricButton.querySelector("img")).toBeNull();
  });
});
