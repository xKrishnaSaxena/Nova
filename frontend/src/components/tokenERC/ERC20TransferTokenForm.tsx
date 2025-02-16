import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiSend, FiLoader, FiDollarSign } from "react-icons/fi";
import { transferTokens } from "../../utils/tokenERCdapp";
import { FaWallet } from "react-icons/fa";

const TransferTokensForm: FC = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await transferTokens(tokenAddress, recipient, Number(amount));
      setSuccess("Tokens transferred successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to transfer tokens"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleTransfer}
      className="space-y-6 w-full"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
        >
          Transfer Tokens
        </motion.h1>
        <p className="text-gray-400">Send tokens to another wallet address</p>
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FaWallet className="text-lg" />
          Token Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiArrowRight className="text-lg" />
          Recipient Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiDollarSign className="text-lg" />
          Amount
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-600"
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
          className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm"
        >
          {success}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? (
          <FiLoader className="animate-spin text-xl" />
        ) : (
          <>
            <FiSend className="text-xl" />
            Transfer Tokens
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default TransferTokensForm;
