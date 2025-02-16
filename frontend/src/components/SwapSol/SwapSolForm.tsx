import React, { useState } from "react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import { GiJupiter } from "react-icons/gi";
import { FiArrowRight, FiDollarSign, FiRefreshCw } from "react-icons/fi";

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/jmL5bKAaO34Bk3hBmzhzNY3OACd_wu5N"
); //use personal api not mainnet-beta

const SwapForm: React.FC = () => {
  const { publicKey, sendTransaction, wallet } = useWallet();
  const [inputToken, setInputToken] = useState<string>("");
  const [outputToken, setOutputToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuote = async () => {
    if (!inputToken || !outputToken || !amount) return;
    setLoading(true);
    try {
      let response = await axios.get<{ outAmount: string }>(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${amount}&slippageBps=50`
      );

      console.log(response.data);
      setQuote(response.data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
    setLoading(false);
  };

  const handleSwap = async () => {
    if (!quote || !publicKey) return;
    setLoading(true);
    try {
      const { data }: { data: { swapTransaction: string } } = await axios.post(
        "https://quote-api.jup.ag/v6/swap",
        {
          quoteResponse: quote,
          userPublicKey: publicKey.toString(),
        }
      );

      const swapTransactionBuf = Buffer.from(data.swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      console.log(transaction);
      //@ts-ignore
      transaction.feePayer = wallet?.adapter.publicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: await sendTransaction(transaction, connection),
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      console.log(
        `Transaction successful: https://solscan.io/tx/${transaction}`
      );
    } catch (error) {
      console.error("Error executing swap:", error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2"
        >
          <GiJupiter className="text-2xl" />
          Token Swap
        </motion.h2>
        <p className="text-gray-400">Instant cross-token exchange</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
            <FiDollarSign className="text-lg" />
            Input Token
          </label>
          <input
            type="text"
            placeholder="Token mint address (e.g. So111...)"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        <div className="flex justify-center">
          <FiArrowRight className="text-2xl text-purple-500 rotate-90" />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
            <FiDollarSign className="text-lg" />
            Output Token
          </label>
          <input
            type="text"
            placeholder="Token mint address (e.g. EPjFW...)"
            value={outputToken}
            onChange={(e) => setOutputToken(e.target.value)}
            className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
            <FiArrowRight className="text-lg" />
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount to swap"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-white w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchQuote}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
        >
          <FiRefreshCw className={`text-xl ${loading && "animate-spin"}`} />
          {loading ? "Fetching Quote..." : "Get Quote"}
        </motion.button>

        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-white/5 border border-white/10 rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Estimated Output:</span>
              <span className="font-semibold text-purple-400">
                {quote.outAmount}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwap}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-cyan-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
            >
              <FiArrowRight className="text-xl" />
              {loading ? "Processing Swap..." : "Confirm Swap"}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SwapForm;
