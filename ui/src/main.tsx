import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

const props = (window as any).__APP_PROPS__;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App payload={props} />
  </StrictMode>
);
