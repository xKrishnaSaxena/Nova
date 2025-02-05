import { FC, useState } from "react";

interface MintTokenFormProps {
  onMint: (
    mintAddress: string,
    recipient: string,
    amount: string
  ) => Promise<void>;
}

const MintTokenFormSPL: FC<MintTokenFormProps> = ({ onMint }) => {
  const [mintAddress, setMintAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onMint(mintAddress, recipient, amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Token Mint Address"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount to Mint"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Mint Tokens</button>
    </form>
  );
};

export default MintTokenFormSPL;
