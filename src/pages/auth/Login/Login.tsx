import styles from "./Login.module.scss";
import { useLogin } from "./useLogin";

export function Login() {
  const { step, data, error, setField, handleNext, handleSubmit, prev } =
    useLogin();

  return (
    <div className={styles.container}>
      <h1 className={styles.srOnly}>Login</h1>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Login to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {step === 0 && (
            <>
              <input
                data-testid="email-input"
                className={styles.input}
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleNext}
              >
                Continue
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <input
                data-testid="password-input"
                className={styles.input}
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setField("password", e.target.value)}
              />

              <div className={styles.actions}>
                <button type="button" onClick={prev}>
                  Back
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  data-testid="login-button"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
