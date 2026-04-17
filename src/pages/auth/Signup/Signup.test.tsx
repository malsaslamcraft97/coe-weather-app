import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Signup } from "./Signup";
import { AppContext } from "../../../context/AppProvider";

describe("Signup form", () => {
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
        <Signup />
      </AppContext.Provider>,
    );

    return { user, mockLogin };
  };

  it("shows error when name is empty", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const { user } = setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "Aslam");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Email"), "invalid");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const { user } = setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "Aslam");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Password"), "123456");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "654321");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("calls signup (login) when form is valid", async () => {
    const { user, mockLogin } = setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "Aslam");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await user.type(screen.getByPlaceholderText("Password"), "123456");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "123456");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockLogin).toHaveBeenCalled();
  });
});
