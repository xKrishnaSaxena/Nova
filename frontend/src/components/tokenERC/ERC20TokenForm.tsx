import { useState } from "react";
import { createERC20Token } from "../../utils/tokenERCdapp";

const ERC20TokenForm = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const address = await createERC20Token(name, symbol);
      setTokenAddress(address);
      alert(`Token created successfully! Address: ${address}`);
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create ERC-20 Token</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Token Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Token Symbol:</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Token
        </button>
      </form>

      {tokenAddress && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-center">
          <p className="text-sm font-semibold">Token Address:</p>
          <p className="text-xs break-all">{tokenAddress}</p>
        </div>
      )}
    </div>
  );
};

export default ERC20TokenForm;
