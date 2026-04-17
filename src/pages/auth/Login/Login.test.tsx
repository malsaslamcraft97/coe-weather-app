import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./Login";
import { AppContext } from "../../../context/AppProvider";

describe("Login form", () => {
  const setup = () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();

    render(
      <AppContext.Provider
        value={{
          state: {} as any,
          dispatch: vi.fn(),
          actions: {
            login: mockLogin,
            searchWeather: vi.fn(),
            retrySearch: vi.fn(),
            selectUnit: vi.fn(),
          },
        }}
      >
        <Login />
      </AppContext.Provider>,
    );

    return { user, mockLogin };
  };

  it("shows error when email is empty", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const { user } = setup();

    await user.type(screen.getByPlaceholderText("Email"), "invalid");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  it("shows error for short password", async () => {
    const { user } = setup();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Password"), "123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("calls login when form is valid", async () => {
    const { user, mockLogin } = setup();

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Password"), "123456");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockLogin).toHaveBeenCalled();
  });
});
