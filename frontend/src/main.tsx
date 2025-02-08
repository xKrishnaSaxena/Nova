import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { UserProvider } from "./contexts/userContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import NavBarComponent from "./components/ui/Navbar.tsx";
import Sidebar from "./components/ui/Sidebar.tsx";

const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/jmL5bKAaO34Bk3hBmzhzNY3OACd_wu5N"
    ),
  },
});
const queryClient = new QueryClient();
const RootComponent = () => {
  const [activeSection, setActiveSection] = useState<"solana" | "ethereum">(
    () => {
      const saved = localStorage.getItem("selectedBlockchain");
      return saved === "ethereum" ? "ethereum" : "solana";
    }
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("selectedBlockchain", activeSection);
  }, [activeSection]);

  const isEthereum = activeSection === "ethereum";
  return (
    <StrictMode>
      <AuthProvider>
        <UserProvider>
          {isEthereum ? (
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <NavBarComponent
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <Sidebar isOpen={isSidebarOpen} activeSection={activeSection} />

                <App />
              </QueryClientProvider>
            </WagmiProvider>
          ) : (
            <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
              <WalletProvider wallets={[]}>
                <WalletModalProvider>
                  <NavBarComponent
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                  <Sidebar
                    isOpen={isSidebarOpen}
                    activeSection={activeSection}
                  />

                  <App />
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          )}
        </UserProvider>
      </AuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<RootComponent />);
