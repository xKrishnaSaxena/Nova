import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

const Deposit = () => {
  const BACKEND_URL = "http://localhost:3000";

  const [depositAddress, setDepositAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { token } = authContext;
  const handleGenerateDepositAddress = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post<{
        depositAddress?: string;
        message?: string;
      }>(`${BACKEND_URL}/api/deposit/generate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.depositAddress)
        setDepositAddress(response.data.depositAddress);
    } catch (error) {
      alert("Deposit address generation failed!");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {depositAddress ? (
        <div>
          <h2 className="text-2xl text-center">DepositAddress</h2>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <h3 className="">{depositAddress}</h3>
        </div>
      ) : (
        <button
          className="px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleGenerateDepositAddress}
        >
          Generate Deposit Address
        </button>
      )}
    </div>
  );
};

export default Deposit;
