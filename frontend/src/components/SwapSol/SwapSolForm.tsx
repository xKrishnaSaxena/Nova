import React, { useState } from "react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

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
    <div className="p-4 bg-gray-800 text-white rounded-lg w-96">
      <h2 className="text-lg font-bold">Token Swap</h2>
      <input
        type="text"
        placeholder="Input Token Address"
        value={inputToken}
        onChange={(e) => setInputToken(e.target.value)}
        className="w-full p-2 my-2 text-white"
      />
      <input
        type="text"
        placeholder="Output Token Address"
        value={outputToken}
        onChange={(e) => setOutputToken(e.target.value)}
        className="w-full p-2 my-2 text-white"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 my-2 text-white"
      />
      <button
        onClick={fetchQuote}
        disabled={loading}
        className="w-full bg-blue-500 p-2 rounded-lg my-2"
      >
        {loading ? "Fetching Quote..." : "Get Quote"}
      </button>
      {quote && (
        <div className="p-2 bg-gray-700 rounded-lg my-2">
          <p>Estimated Output: {quote.outAmount} Tokens</p>
          <button
            onClick={handleSwap}
            disabled={loading}
            className="w-full bg-green-500 p-2 rounded-lg mt-2"
          >
            {loading ? "Swapping..." : "Confirm Swap"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
