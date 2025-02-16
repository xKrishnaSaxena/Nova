import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import ManageAuthorityForm from "../../components/tokenERC/ERC20ManageAuthoritiesForm";

export default function ManageAuthorityERC20Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleManage = async (
    tokenAddress: string,
    authorityType: "mint" | "freeze",
    newAuthority: string
  ) => {
    if (!window.ethereum) {
      setError("Ethereum wallet required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!ethers.isAddress(tokenAddress))
        throw new Error("Invalid token address");
      if (!ethers.isAddress(newAuthority))
        throw new Error("Invalid authority address");

      const contract = new ethers.Contract(
        tokenAddress,
        [
          "function setMintAuthority(address)",
          "function setFreezeAuthority(address)",
        ],
        signer
      );

      const tx =
        authorityType === "mint"
          ? await contract.setMintAuthority(newAuthority)
          : await contract.setFreezeAuthority(newAuthority);

      await tx.wait();
      setSuccess("Authority updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update authority"
      );
    } finally {
      setLoading(false);
    }
  };

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold animate-background-shift bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent mb-2"
            >
              Manage ERC20 Authorities
            </motion.h1>
            <p className="text-gray-400">Update mint/freeze authorities</p>
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center gap-2"
            >
              <FiLoader className="animate-spin" />
              <span className="text-blue-300">Processing...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300"
            >
              <FiAlertCircle />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-300"
            >
              <FiCheckCircle />
              <span>{success}</span>
            </motion.div>
          )}

          <ManageAuthorityForm onSubmit={handleManage} disabled={loading} />
        </motion.div>
      </div>
    </div>
  );
}
