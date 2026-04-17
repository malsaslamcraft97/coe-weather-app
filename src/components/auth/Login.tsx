import { useState } from "react";
import { useAppContext } from "../../context/AppProvider";
import { useAuthWizard } from "../../hooks/useAuthWizard";

export function Login() {
  const { actions } = useAppContext();

  const { step, data, setField, next, prev } = useAuthWizard();

  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!data.email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePassword = () => {
    if (!data.password) return "Password is required";
    if (data.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleNext = () => {
    const err = validateEmail();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    next();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validatePassword();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    await actions.login();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        {step === 0 && (
          <>
            <input
              data-testid="email-input"
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setField("email", e.target.value)}
            />

            <button type="button" onClick={handleNext}>
              Next
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <input
              data-testid="password-input"
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setField("password", e.target.value)}
            />

            <div>
              <button type="button" onClick={prev}>
                Back
              </button>

              <button data-testid="login-button" type="submit">
                Login
              </button>
            </div>
          </>
        )}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
