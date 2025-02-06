import { useState } from "react";
import { mintTokens } from "../../utils/tokenERCdapp";

const MintTokenForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress || !recipient || !amount) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await mintTokens(tokenAddress, recipient, Number(amount));
      alert("Tokens minted successfully!");
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Failed to mint tokens.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Mint ERC-20 Tokens</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Token Address:</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Mint Tokens
        </button>
      </form>
    </div>
  );
};

export default MintTokenForm;
