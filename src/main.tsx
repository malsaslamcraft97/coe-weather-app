import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./context/AppProvider";
import { AppLoader } from "./components/common/AppLoader";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <Suspense fallback={<AppLoader />}>
        <App />
      </Suspense>
    </AppProvider>
  </React.StrictMode>,
);
