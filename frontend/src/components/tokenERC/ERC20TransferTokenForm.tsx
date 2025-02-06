import { useState } from "react";
import { transferTokens } from "../../utils/tokenERCdapp";
const TransferTokensForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transferTokens(tokenAddress, recipient, Number(amount));
      alert("Tokens transferred successfully!");
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert("Failed to transfer tokens.");
    }
  };

  return (
    <form
      onSubmit={handleTransfer}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-bold">Transfer Tokens</h2>
      <input
        type="text"
        placeholder="Token Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Transfer Tokens
      </button>
    </form>
  );
};

export default TransferTokensForm;
