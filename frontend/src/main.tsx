import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { UserProvider } from "./contexts/userContext.tsx";
import Topbar from "./components/TopBar.tsx";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
          <WalletProvider wallets={[]}>
            <WalletModalProvider>
              <Topbar />
              <App />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
