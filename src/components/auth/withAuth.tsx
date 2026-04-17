import React from "react";

export function withAuth(Component: any) {
  return function Wrapped(props: any) {
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn) {
      return <div>Please login to continue</div>;
    }

    return <Component {...props} />;
  };
}
