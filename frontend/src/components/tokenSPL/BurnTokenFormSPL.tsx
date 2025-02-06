import { FC, useState } from "react";

interface BurnTokenFormProps {
  onSubmit: (mintAddress: string, amount: string) => Promise<void>;
  disabled?: boolean;
}

const BurnTokenForm: FC<BurnTokenFormProps> = ({ onSubmit, disabled }) => {
  const [mintAddress, setMintAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(mintAddress, amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Token Mint Address"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
        disabled={disabled}
      />
      <input
        type="number"
        placeholder="Amount to Burn"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={disabled}
        step="any"
      />
      <button type="submit" disabled={disabled}>
        {disabled ? "Burning..." : "Burn Tokens"}
      </button>
    </form>
  );
};

export default BurnTokenForm;
