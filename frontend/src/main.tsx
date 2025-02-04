import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { UserProvider } from "./contexts/userContext.tsx";
import Topbar from "./components/TopBar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <Topbar />
        <App />
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
