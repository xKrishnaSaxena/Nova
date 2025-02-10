// CreateTokenPageERC.tsx
import { motion } from "framer-motion";
import ERC20TokenForm from "../../components/tokenERC/ERC20TokenForm";
import { createERC20Token } from "../../utils/tokenERCdapp";
import { FiLoader } from "react-icons/fi";
import { useState } from "react";

const CreateTokenPageERC = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateToken = async (name: string, symbol: string) => {
    try {
      setLoading(true);
      setError("");
      const address = await createERC20Token(name, symbol);
      setTokenAddress(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center text-white justify-center p-4">
      <motion.div
        className="absolute top-12 right-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
        animate={{ rotate: [0, 15, -15, 0], y: [-30, 30] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <motion.img
          src="Eth.png"
          className="w-full h-full mt-12 text-purple-500/20"
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
            >
              Create ERC-20 Token
            </motion.h1>
            <p className="text-gray-400">
              Deploy your custom ERC-20 token on Ethereum
            </p>
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center gap-2"
            >
              <FiLoader className="animate-spin" />
              <span className="text-blue-300">Deploying token...</span>
            </motion.div>
          )}

          <ERC20TokenForm
            onCreate={handleCreateToken}
            tokenAddress={tokenAddress}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTokenPageERC;
