import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiKey, FiUser, FiDollarSign } from "react-icons/fi";

interface MintTokenFormProps {
  onMint: (
    mintAddress: string,
    recipient: string,
    amount: string
  ) => Promise<void>;
}

const MintTokenFormSPL: FC<MintTokenFormProps> = ({ onMint }) => {
  const [mintAddress, setMintAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onMint(mintAddress, recipient, amount);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
    >
      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiKey className="text-lg" />
          Token Mint Address
        </label>
        <input
          type="text"
          placeholder="Enter token mint address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600 text-white"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiUser className="text-lg" />
          Recipient Address
        </label>
        <input
          type="text"
          placeholder="Enter recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiDollarSign className="text-lg" />
          Amount to Mint
        </label>
        <input
          type="number"
          placeholder="Enter amount to mint"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
      >
        <FiDollarSign className="text-xl" />
        Mint Tokens
      </motion.button>
    </motion.form>
  );
};

export default MintTokenFormSPL;
