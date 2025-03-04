import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import QRCode from "react-qr-code";
import { useUser } from "../contexts/userContext";
import { motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";

const Deposit = ({
  activeSection,
}: {
  activeSection: "solana" | "ethereum";
}) => {
  const BACKEND_URL = "https://nova-backend-as1d.onrender.com/";
  const { user } = useUser();
  const [depositAddress, setDepositAddress] = useState("");

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { token } = authContext;

  const handleGenerateDepositAddress = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post<{
        ethDepositAddress?: string;
        solDepositAddress?: string;

        message?: string;
      }>(`${BACKEND_URL}/api/deposit/generate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (activeSection === "ethereum" && response.data.ethDepositAddress) {
        setDepositAddress(response.data.ethDepositAddress);
      } else if (
        activeSection === "solana" &&
        response.data.solDepositAddress
      ) {
        setDepositAddress(response.data.solDepositAddress);
      }
    } catch (error) {
      alert("Deposit address generation failed!");
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      const address =
        activeSection === "ethereum"
          ? user.ethDepositAddress
          : user.solDepositAddress;
      setDepositAddress(address || "");
    }
  }, [user, activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center justify-center p-4">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-white w-full max-w-md bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
          >
            Deposit Funds
          </motion.h2>
          <p className="text-gray-400">Receive assets to your Nova wallet</p>
        </div>

        {!token ? (
          <div className="space-y-6 text-center">
            <p className="text-gray-400">
              Please log in or sign up to generate a deposit address.
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
        ) : depositAddress ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                <FaWallet className="text-lg" />
                Your Deposit Address
              </label>
              <div className="relative">
                <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                  <span className="truncate">{depositAddress}</span>
                  <button className="text-purple-400 hover:text-purple-300 ml-2">
                    {/*TODO - COPY BUTTON NOT WORKING*/}
                    <FiCopy className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCode
                  value={depositAddress}
                  size={192}
                  className="w-48 h-48"
                />
              </div>
              <p className="text-gray-400 text-sm text-center">
                Scan QR code or copy address to receive funds
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateDepositAddress}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            Generate Deposit Address
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Deposit;
