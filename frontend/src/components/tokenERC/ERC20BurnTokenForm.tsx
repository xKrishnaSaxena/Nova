import { useState } from "react";
import { burnTokens } from "../../utils/tokenERCdapp";

const BurnTokensForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await burnTokens(tokenAddress, Number(amount));
      alert("Tokens burned successfully!");
    } catch (error) {
      console.error("Error burning tokens:", error);
      alert("Failed to burn tokens.");
    }
  };

  return (
    <form
      onSubmit={handleBurn}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-bold">Burn Tokens</h2>
      <input
        type="text"
        placeholder="Token Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
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
      <button type="submit" className="bg-red-500 text-white p-2 rounded">
        Burn Tokens
      </button>
    </form>
  );
};

export default BurnTokensForm;
