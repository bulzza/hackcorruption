import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";

import "../src/styles/globals.css";
import "../src/styles/landing.css";
// Add a data styles file (next step)
import "../src/styles/data.css";

const router = createBrowserRouter([{ path: "/*", element: <App /> }]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  </React.StrictMode>
);
