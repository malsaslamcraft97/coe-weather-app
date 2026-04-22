import React from "react";
import { useAppContext } from "../../context/AppProvider";
import { Login } from "../../pages/auth/Login/Login";
import { Signup } from "../../pages/auth/Signup/Signup";
import styles from "../../App.module.scss";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = (props: P) => {
    const { state } = useAppContext();
    const [mode, setMode] = React.useState<"login" | "signup">("login");

    // FIX: Ensure unauthenticated state also has a <main> landmark
    if (!state.isAuthenticated) {
      return (
        <main>
          {mode === "login" ? (
            <>
              <Login />
              <p className={styles.authSwitchText}>
                Don’t have an account?{" "}
                <button onClick={() => setMode("signup")}>Sign up</button>
              </p>
            </>
          ) : (
            <>
              <Signup />
              <p className={styles.authSwitchText}>
                Already have an account?{" "}
                <button onClick={() => setMode("login")}>Login</button>
              </p>
            </>
          )}
        </main>
      );
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}
