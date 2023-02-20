import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";


createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  // </StrictMode>

);
