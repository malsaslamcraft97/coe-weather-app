import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./Login";
import { AppContext } from "../../context/AppProvider";

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

  it("shows error when fields are empty", async () => {
    const { user } = setup();

    await user.click(screen.getByTestId("login-button"));

    expect(
      screen.getByText("Email and password are required"),
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const { user } = setup();

    await user.type(screen.getByTestId("email-input"), "invalid");
    await user.type(screen.getByTestId("password-input"), "123456");

    await user.click(screen.getByTestId("login-button"));

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  it("shows error for short password", async () => {
    const { user } = setup();

    await user.type(screen.getByTestId("email-input"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "123");

    await user.click(screen.getByTestId("login-button"));

    expect(
      screen.getByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("calls login when form is valid", async () => {
    const { user, mockLogin } = setup();

    await user.type(screen.getByTestId("email-input"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "123456");

    await user.click(screen.getByTestId("login-button"));

    expect(mockLogin).toHaveBeenCalled();
  });
});
