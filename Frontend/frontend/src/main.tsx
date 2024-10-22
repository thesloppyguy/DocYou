import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <App />
      <ThemePanel />
    </Theme>
  </StrictMode>
);
