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
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiArrowUp,
  FiDollarSign,
} from "react-icons/fi";
import Logo from "./Logo";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";
import { div } from "framer-motion/client";

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
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isEthereum = activeSection === "ethereum";
  const ethAccount = isEthereum ? useAccount() : null;
  const ethConnect = isEthereum ? useConnect() : null;
  const ethDisconnect = isEthereum ? useDisconnect() : null;
  const wallet = useWallet();

  const handleChainSwitch = (chain: "solana" | "ethereum") => {
    setActiveSection(chain);
  };

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
              onClick={() => handleChainSwitch(chain)}
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
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>
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
                <p className="text-sm text-gray-400 mt-1 truncate">
                  {user?.depositAddress?.slice(0, 16) || "No Address"}...
                </p>
              </div>

              <div className="p-4 border-b border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400">
                    Available Balance
                  </span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {user?.balance ?? 0} {isEthereum ? "ETH" : "SOL"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm"
                  >
                    <FiDollarSign className="text-base" />
                    Deposit
                  </motion.button>
                  <motion.button
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
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

              {!user && (
                <div className="p-2 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex text-white items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5"
                  >
                    <FiLogIn className="text-green-400" />
                    Login
                  </motion.button>
                  <motion.button
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
