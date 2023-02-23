// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import "./i18n/config";


import "./index.scss";


createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  // </StrictMode>

);
