import React from "react";
import { useAppContext } from "../../context/AppProvider";
import { Login } from "../../pages/auth/Login/Login";
import { Signup } from "../../pages/auth/Signup/Signup";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = (props: P) => {
    const { state } = useAppContext();
    const [mode, setMode] = React.useState<"login" | "signup">("login");

    if (!state.isAuthenticated) {
      return mode === "login" ? (
        <>
          <Login />
          <p>
            Don’t have an account?{" "}
            <button onClick={() => setMode("signup")}>Sign up</button>
          </p>
        </>
      ) : (
        <>
          <Signup />
          <p>
            Already have an account?{" "}
            <button onClick={() => setMode("login")}>Login</button>
          </p>
        </>
      );
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}
