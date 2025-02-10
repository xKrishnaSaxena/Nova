import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { mintToAddress } from "../../utils/tokenSPL";
import MintTokenFormSPL from "../../components/tokenSPL/MintTokenFormSPL";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

export default function MintTokenPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleMintToken = async (
    mintAddress: string,
    recipient: string,
    amount: string
  ) => {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber)) throw new Error("Invalid mint amount");

      const mintPublicKey = new PublicKey(mintAddress);
      const recipientPublicKey = new PublicKey(recipient);

      const transaction = await mintToAddress(
        connection,
        mintPublicKey,
        wallet.publicKey,
        recipientPublicKey,
        amountNumber
      );

      transaction.feePayer = wallet.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const txSignature = await wallet.sendTransaction(transaction, connection);

      const { lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      });

      setSuccess("Tokens minted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint tokens");
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
          src="Sol.png"
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
              className="text-4xl font-bold animate-background-shift bg-gradient-to-r from-amber-400 via-orange-300 to-red-400 bg-clip-text text-transparent mb-2"
            >
              Mint Existing Token
            </motion.h1>

            <p className="text-gray-400">Generate new token supply</p>
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

          <MintTokenFormSPL onMint={handleMintToken} />
        </motion.div>
      </div>
    </div>
  );
}
