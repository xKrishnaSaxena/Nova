import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../contexts/userContext";
import { motion } from "framer-motion";
import { FiArrowUp, FiDollarSign } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { PublicKey } from "@solana/web3.js";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

interface WithdrawResponse {
  txHash: string;
  amount: number;
  toAddress: string;
  status: string;
}

const Withdraw = ({
  activeSection,
}: {
  activeSection: "solana" | "ethereum";
}) => {
  const BACKEND_URL = "http://localhost:3000";
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useUser();
  const { token } = useContext(AuthContext)!;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      toast.error("Please log in or sign up to withdraw funds.");
      setLoading(false);
      return;
    }
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Invalid amount");
      }

      if (activeSection === "ethereum") {
        if (!toAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
          throw new Error("Invalid Ethereum address");
        }
      } else {
        try {
          new PublicKey(toAddress);
        } catch {
          throw new Error("Invalid Solana address");
        }
      }

      const response = await axios.post<WithdrawResponse>(
        `${BACKEND_URL}/api/withdraw`,
        {
          toAddress,
          amount: numericAmount,
          currency: activeSection === "solana" ? "SOL" : "ETH",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Withdrawal initiated! TX Hash: ${response.data.txHash}`, {
        style: {
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(5, 150, 105, 0.3)",
          color: "#34D399",
        },
        iconTheme: {
          primary: "#34D399",
          secondary: "#059669",
        },
      });
      refreshUser();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to process withdrawal",
        {
          style: {
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            color: "#F87171",
          },
          iconTheme: {
            primary: "#F87171",
            secondary: "#DC2626",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center justify-center p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "backdrop-blur-xl",
          duration: 5000,
        }}
      />
      <motion.div
        className="absolute top-12 right-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
        animate={{ rotate: [0, 15, -15, 0], y: [-30, 30] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <motion.img
          src={activeSection === "solana" ? "Sol.png" : "Eth.png"}
          className="w-full h-full mt-12 text-purple-500/20"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
        animate={{ rotate: [0, -15, 15, 0], y: [30, -30] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <motion.img
          src={activeSection === "solana" ? "Sol.png" : "Eth.png"}
          className="w-full h-full text-purple-500/20"
        />
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleWithdraw}
        className="text-white w-full max-w-md bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
          >
            Withdraw {activeSection === "solana" ? "SOL" : "ETH"}
          </motion.h2>
          <p className="text-gray-400">Transfer assets from your Nova wallet</p>
        </div>
        {!token ? (
          <div className="space-y-6 text-center">
            <p className="text-gray-400">
              Please log in or sign up to Withdraw your assets
            </p>
            <div className="flex flex-col gap-4">
              <Link
                to="/login"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg hover:shadow-xl transition-all"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg hover:shadow-xl transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <>
            {" "}
            {user && (
              <div className="mb-6 space-y-2">
                <p className="text-gray-300 flex justify-between">
                  <span>Current Balance:</span>
                  <span className="text-purple-400">
                    {activeSection === "solana"
                      ? user.solBalance?.toFixed(4) + " SOL"
                      : user.ethBalance?.toFixed(4) + " ETH"}
                  </span>
                </p>
                <p className="text-gray-300 flex justify-between">
                  <span>Your Address:</span>
                  <span className="text-blue-400 truncate max-w-[160px]">
                    {activeSection === "solana"
                      ? user.solDepositAddress
                      : user.ethDepositAddress}
                  </span>
                </p>
              </div>
            )}{" "}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <FaWallet className="text-lg" />
                  Recipient Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="toAddress"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
                    placeholder={
                      activeSection === "solana" ? "Solana address..." : "0x..."
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <FiDollarSign className="text-lg" />
                  Amount ({activeSection === "solana" ? "SOL" : "ETH"})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
                    step="0.0001"
                    min="0.0001"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  loading ||
                  !user?.ethDepositAddress ||
                  !user?.solDepositAddress
                }
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiArrowUp className="text-xl" />
                {loading ? "Processing..." : "Withdraw"}
              </motion.button>
            </div>
          </>
        )}
      </motion.form>
    </div>
  );
};

export default Withdraw;
