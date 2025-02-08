import { Dispatch, SetStateAction, useState } from "react";
import { useUser } from "../../contexts/userContext";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import {
  FiDatabase,
  FiMenu,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import Logo from "./Logo";
import { useWallet } from "@solana/wallet-adapter-react";

interface NavBarProps {
  activeSection: "solana" | "ethereum";
  setActiveSection: Dispatch<SetStateAction<"solana" | "ethereum">>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const NovaLogo = () => <Logo />;

export default function NavBarComponent({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}: NavBarProps) {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isEthereum = activeSection === "ethereum";
  const ethAccount = isEthereum ? useAccount() : null;
  const ethConnect = isEthereum ? useConnect() : null;
  const ethDisconnect = isEthereum ? useDisconnect() : null;
  const wallet = useWallet();
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChainSwitch = (chain: "solana" | "ethereum") => {
    setActiveSection(chain);
  };

  return (
    <div className="flex h-16 items-center justify-between px-4 border-b">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => handleChainSwitch("solana")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeSection === "solana"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            <FiDatabase />
            Solana
          </button>
          <button
            onClick={() => handleChainSwitch("ethereum")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeSection === "ethereum"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            <FiDatabase />
            Ethereum
          </button>
        </div>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NovaLogo />
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {darkMode ? <FiMoon /> : <FiSun />}
        </button>

        <span className="text-sm">
          💰 {user?.balance ?? 0} {isEthereum ? "ETH" : "SOL"}
        </span>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
          >
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              className="w-8 h-8 rounded-full"
              alt="User"
            />
            <span>{user?.username || "Guest"}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2">
              <div className="px-4 py-2 border-b">
                <p className="font-semibold">{user?.username || "Guest"}</p>
                <p className="text-sm truncate">
                  {user?.depositAddress?.slice(0, 16) || "No Address"}...
                </p>
              </div>

              {isEthereum ? (
                ethAccount?.isConnected ? (
                  <>
                    <div className="px-4 py-2 text-sm">
                      🔗 {ethAccount.address?.slice(0, 6)}...
                      {ethAccount.address?.slice(-4)}
                    </div>
                    <button
                      onClick={() => ethDisconnect?.disconnect()}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <FiLogOut /> Disconnect Ethereum
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      ethConnect?.connect({
                        connector: ethConnect.connectors[0],
                      })
                    }
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FiUser /> Connect Ethereum
                  </button>
                )
              ) : (
                <>
                  <WalletMultiButton className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" />
                  {wallet.publicKey && (
                    <WalletDisconnectButton className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
