import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiKey, FiAlertTriangle } from "react-icons/fi";
import { FaFire } from "react-icons/fa";

interface BurnTokenFormProps {
  onSubmit: (mintAddress: string, amount: string) => Promise<void>;
  disabled?: boolean;
}

const BurnTokenForm: FC<BurnTokenFormProps> = ({ onSubmit, disabled }) => {
  const [mintAddress, setMintAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(mintAddress, amount);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
    >
      <div className="relative">
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiKey className="text-lg" />
          Token Mint Address
        </label>
        <input
          type="text"
          placeholder="Enter token mint address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50 text-white"
          required
        />
      </div>

      <div className="relative">
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FaFire className="text-lg" />
          Amount to Burn
        </label>
        <input
          type="number"
          placeholder="Enter amount to burn"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled}
          step="any"
          className="w-full text-white px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
          required
        />
      </div>

      <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        type="submit"
        disabled={disabled}
        className={`w-full py-3.5 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
          disabled
            ? "bg-gray-600/50 cursor-not-allowed"
            : "bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-xl"
        }`}
      >
        <FiAlertTriangle className="text-xl" />
        {disabled ? "Burning..." : "Burn Tokens"}
      </motion.button>
    </motion.form>
  );
};

export default BurnTokenForm;
