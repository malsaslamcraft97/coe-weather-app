import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./context/AppProvider";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <Suspense fallback={<div>Loading app...</div>}>
        <App />
      </Suspense>
    </AppProvider>
  </React.StrictMode>,
);
