import styles from "./Signup.module.scss";
import { useSignup } from "./useSignup";

export function Signup() {
  const { step, data, error, setField, handleNext, handleSubmit, prev } =
    useSignup();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Sign up to get started</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {step === 0 && (
            <>
              <input
                className={styles.input}
                placeholder="Full Name"
                value={data.name || ""}
                onChange={(e) => setField("name", e.target.value)}
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
                className={styles.input}
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setField("email", e.target.value)}
              />

              <div className={styles.actions}>
                <button type="button" onClick={prev}>
                  Back
                </button>

                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handleNext}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setField("password", e.target.value)}
              />

              <input
                className={styles.input}
                type="password"
                placeholder="Confirm Password"
                value={data.confirmPassword || ""}
                onChange={(e) => setField("confirmPassword", e.target.value)}
              />

              <div className={styles.actions}>
                <button type="button" onClick={prev}>
                  Back
                </button>

                <button type="submit" className={styles.primaryBtn}>
                  Create Account
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
