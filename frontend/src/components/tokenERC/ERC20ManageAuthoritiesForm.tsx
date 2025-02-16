import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiKey, FiUsers, FiRefreshCw, FiAlertOctagon } from "react-icons/fi";

interface ManageAuthorityFormProps {
  onSubmit: (
    tokenAddress: string,
    authorityType: "mint" | "freeze",
    newAuthority: string
  ) => Promise<void>;
  disabled?: boolean;
}

const ManageAuthorityForm: FC<ManageAuthorityFormProps> = ({
  onSubmit,
  disabled,
}) => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [authorityType, setAuthorityType] = useState<"mint" | "freeze">("mint");
  const [newAuthority, setNewAuthority] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(tokenAddress, authorityType, newAuthority.trim());
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
          Token Address
        </label>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          disabled={disabled}
          placeholder="Enter token contract address"
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiUsers className="text-lg" />
          Authority Type
        </label>
        <div className="relative">
          <select
            value={authorityType}
            onChange={(e) =>
              setAuthorityType(e.target.value as "mint" | "freeze")
            }
            disabled={disabled}
            className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none disabled:opacity-50"
          >
            <option value="mint">Mint Authority</option>
            <option value="freeze">Freeze Authority</option>
          </select>
          <FiRefreshCw className="absolute right-4 top-4 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiAlertOctagon className="text-lg" />
          New Authority Address
        </label>
        <input
          type="text"
          value={newAuthority}
          onChange={(e) => setNewAuthority(e.target.value)}
          disabled={disabled}
          placeholder="Enter new authority address (0x...)"
          className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
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
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl"
        }`}
      >
        <FiRefreshCw className="text-xl" />
        {disabled ? "Processing..." : "Update Authority"}
      </motion.button>
    </motion.form>
  );
};

export default ManageAuthorityForm;
