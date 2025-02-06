import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { UserProvider } from "./contexts/userContext.tsx";
import Topbar from "./components/TopBar.tsx";
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
  const [isEthereum, setIsEthereum] = useState(true);

  return (
    <StrictMode>
      <AuthProvider>
        <UserProvider>
          {isEthereum ? (
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <Topbar isEthereum={isEthereum} setIsEthereum={setIsEthereum} />
                <App />
              </QueryClientProvider>
            </WagmiProvider>
          ) : (
            <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
              <WalletProvider wallets={[]}>
                <WalletModalProvider>
                  <Topbar
                    isEthereum={isEthereum}
                    setIsEthereum={setIsEthereum}
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
