import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchHero } from "./SearchHero";

describe("SearchHero", () => {
  it("calls onQueryChange with the latest search value", () => {
    const onQueryChange = vi.fn();

    render(
      <SearchHero query="" onQueryChange={onQueryChange} onSubmit={vi.fn()} />,
    );

    fireEvent.change(screen.getByRole("searchbox", { name: /search location/i }), {
      target: { value: "Berlin" },
    });

    expect(onQueryChange).toHaveBeenCalledWith("Berlin");
  });

  it("submits even when the query is whitespace only", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault(),
    );

    render(
      <SearchHero query="   " onQueryChange={vi.fn()} onSubmit={onSubmit} />,
    );

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders very long search queries without truncating the value", () => {
    const longQuery = "Llanfairpwllgwyngyll".repeat(8);

    render(
      <SearchHero
        query={longQuery}
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("searchbox", { name: /search location/i })).toHaveValue(
      longQuery,
    );
  });
});
