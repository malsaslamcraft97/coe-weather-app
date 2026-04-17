import React from "react";
import { useAppContext } from "../../context/AppProvider";
import { Login } from "./Login";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = (props: P) => {
    const { state } = useAppContext();

    if (!state.isAuthenticated) {
      return <Login />;
    }

    return <Component {...props} />;
  };

  // helpful for React DevTools
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
}
