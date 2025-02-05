import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../contexts/userContext";

interface WithdrawResponse {
  txHash: string;
  amount: number;
  toAddress: string;
  status: string;
}
const Withdraw = () => {
  const BACKEND_URL = "http://localhost:3000";
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useUser();
  const { token } = useContext(AuthContext)!;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Invalid amount");
      }

      if (!toAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid Ethereum address");
      }

      const response = await axios.post<WithdrawResponse>(
        `${BACKEND_URL}/api/withdraw`,
        {
          toAddress,
          amount: numericAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Withdrawal initiated! TX Hash: ${response.data.txHash}`);
      refreshUser();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process withdrawal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Withdraw Funds</h2>
      {user && (
        <div className="mb-4">
          <p className="text-gray-600">
            Current Balance: {user.balance?.toFixed(4)} ETH
          </p>
          <p className="text-gray-600">Your Address: {user.depositAddress}</p>
        </div>
      )}

      <form onSubmit={handleWithdraw}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="toAddress">
            Recipient Address
          </label>
          <input
            type="text"
            id="toAddress"
            className="w-full p-2 border rounded"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="amount">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="amount"
            className="w-full p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0.0001"
            required
          />
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading || !user?.depositAddress}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
