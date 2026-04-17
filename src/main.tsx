import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.scss";
import { AppProvider } from "./context/AppProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </AppProvider>
  </React.StrictMode>,
);
