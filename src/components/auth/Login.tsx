import { useAppContext } from "../../context/AppProvider";

export function Login() {
  const { actions } = useAppContext();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Login</h2>
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      <button data-testid="login-button" onClick={() => void actions.login()}>
        Login
      </button>
    </div>
  );
}
