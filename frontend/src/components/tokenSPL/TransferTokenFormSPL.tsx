import { FC, useState } from "react";

interface TransferTokenFormProps {
  onSubmit: (
    mintAddress: string,
    recipient: string,
    amount: string
  ) => Promise<void>;
  disabled?: boolean;
}

const TransferTokenForm: FC<TransferTokenFormProps> = ({
  onSubmit,
  disabled,
}) => {
  const [mintAddress, setMintAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(mintAddress, recipient, amount);
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
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        disabled={disabled}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        {disabled ? "Transferring..." : "Transfer Tokens"}
      </button>
    </form>
  );
};

export default TransferTokenForm;
