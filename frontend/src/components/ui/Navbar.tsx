import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "../../contexts/userContext";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import {
  FiDatabase,
  FiMenu,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiArrowUp,
  FiDollarSign,
  FiList,
} from "react-icons/fi";
import Logo from "./Logo";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";

import { SiEthereum } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { AuthContext } from "../../contexts/authContext";
interface NavBarProps {
  activeSection: "solana" | "ethereum";
  setActiveSection: Dispatch<SetStateAction<"solana" | "ethereum">>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function NavBarComponent({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}: NavBarProps) {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isEthereum = activeSection === "ethereum";
  const ethAccount = isEthereum ? useAccount() : null;
  const ethConnect = isEthereum ? useConnect() : null;
  const ethDisconnect = isEthereum ? useDisconnect() : null;
  const wallet = useWallet();

  const handleChainSwitch = (chain: "solana" | "ethereum") => {
    setActiveSection(chain);
    setIsSidebarOpen(true);

    const currentPath = location.pathname;

    // Define route mappings between Solana and Ethereum
    const routeMappings: Record<string, string> = {
      "/spl-create": "/erc-create",
      "/erc-create": "/spl-create",
      "/spl-mint": "/erc-mint",
      "/erc-mint": "/spl-mint",
      "/spl-transfer": "/erc-transfer",
      "/erc-transfer": "/spl-transfer",
      "/spl-burn": "/erc-burn",
      "/erc-burn": "/spl-burn",
      "/spl-manage": "/erc-manage",
      "/erc-manage": "/spl-manage",
      "/tokens-spl": "/tokens-erc",
      "/tokens-erc": "/tokens-spl",
      "/erc-swap": "/spl-swap",
    };

    const newPath = routeMappings[currentPath];

    if (newPath) {
      navigate(newPath, { replace: true });
    }
  };
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const currentAddress =
    activeSection === "ethereum"
      ? user?.ethDepositAddress
      : user?.solDepositAddress;

  const currentBalance =
    activeSection === "ethereum" ? user?.ethBalance : user?.solBalance;
  useEffect(() => {
    if (authContext?.token) {
      refreshUser();
    }
  }, [authContext?.token, refreshUser]);

  return (
    <div className="flex h-16 items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl fixed w-full top-0 z-50">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/5 rounded-xl"
        >
          <FiMenu className="text-xl text-gray-300" />
        </motion.button>

        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
          {["solana", "ethereum"].map((chain: any) => (
            <motion.button
              key={chain}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                handleChainSwitch(chain);
                setIsSidebarOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeSection === chain
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <FiDatabase />
              {chain.charAt(0).toUpperCase() + chain.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.button>
      </div>

      <div className="flex items-center gap-4 ">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
          >
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              className="w-8 h-8 rounded-full"
              alt="User"
            />
            <span className="text-white">{user?.username || "Guest"}</span>
          </button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <p className="font-semibold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {user?.username || "Guest"}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {currentAddress?.slice(0, 16) || "No Address"}...
                  </p>
                  {currentAddress && (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => copyToClipboard(currentAddress)}
                        className="text-gray-400 hover:text-purple-400 ml-2"
                      >
                        <FiCopy className="text-sm" />
                      </motion.button>

                      {isCopied && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-6 right-0 px-2 py-1 bg-purple-500/80 text-white text-xs rounded-md"
                        >
                          Copied!
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-b border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400">
                    Available Balance
                  </span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {currentBalance?.toFixed(4) ?? 0}{" "}
                    {activeSection === "ethereum" ? "ETH" : "SOL"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => navigate("/deposit")}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm"
                  >
                    <FiDollarSign className="text-base" />
                    Deposit
                  </motion.button>
                  <motion.button
                    onClick={() => navigate("/withdraw")}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm"
                  >
                    <FiArrowUp className="text-base" />
                    Withdraw
                  </motion.button>
                </div>
              </div>

              <div className="p-2">
                {isEthereum ? (
                  ethAccount?.isConnected ? (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-400 flex items-center gap-2">
                        <SiEthereum className="text-blue-400" />
                        {ethAccount.address?.slice(0, 6)}...
                        {ethAccount.address?.slice(-4)}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => ethDisconnect?.disconnect()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400"
                      >
                        <FiLogOut />
                        Disconnect Wallet
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() =>
                        ethConnect?.connect({
                          connector: ethConnect.connectors[0],
                        })
                      }
                      className="w-full text-white flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                    >
                      <FiUser className="text-blue-400" />
                      Connect Ethereum
                    </motion.button>
                  )
                ) : (
                  <div className="p-2">
                    <WalletMultiButton className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 rounded-none" />
                    {wallet.publicKey && (
                      <div className="mt-4">
                        <WalletDisconnectButton className="w-full flex items-center gap-3 px-4  py-2.5 text-sm hover:bg-red-500/10 text-red-400 rounded-none" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-white/10">
                {activeSection === "ethereum" ? (
                  <motion.button
                    onClick={() => navigate("/tokens-erc")}
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex text-white items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                  >
                    <FiList className="text-purple-400" />
                    My Tokens
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => navigate("/tokens-spl")}
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex text-white items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                  >
                    <FiList className="text-purple-400" />
                    My Tokens
                  </motion.button>
                )}
              </div>

              {user && (
                <div className="p-2 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      authContext?.logout();
                      alert("Logged out successfully!");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex text-white items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/10"
                  >
                    <FiLogOut className="text-red-400" />
                    Logout
                  </motion.button>
                </div>
              )}
              {!user && (
                <div className="p-2 border-t border-white/10">
                  <motion.button
                    onClick={() => navigate("/login")}
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex text-white items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                  >
                    <FiLogIn className="text-green-400" />
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => navigate("/signup")}
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex text-white items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                  >
                    <FiUserPlus className="text-purple-400" />
                    Sign Up
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
