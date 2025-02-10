import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiLoader } from "react-icons/fi";
import { burnTokens } from "../../utils/tokenERCdapp";
import { FaFire } from "react-icons/fa";

const BurnTokensForm: FC = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await burnTokens(tokenAddress, Number(amount));
      setSuccess("Tokens burned successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to burn tokens");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleBurn}
      className="space-y-6 w-full"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2"
        >
          Burn Tokens
        </motion.h1>
        <p className="text-gray-400">
          Permanently remove tokens from circulation
        </p>
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiAlertTriangle className="text-lg" />
          Token Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FaFire className="text-lg" />
          Amount to Burn
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-300 text-sm"
        >
          {success}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? (
          <FiLoader className="animate-spin text-xl" />
        ) : (
          <>
            <FaFire className="text-xl" />
            Burn Tokens
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default BurnTokensForm;
