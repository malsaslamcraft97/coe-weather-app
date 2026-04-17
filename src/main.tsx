import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./context/AppProvider";
import { AppLoader } from "./components/common/AppLoader";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <Suspense fallback={<AppLoader />}>
          <App />
        </Suspense>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
