import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import TransferTokenForm from "../../components/tokenSPL/TransferTokenFormSPL";
import { transferTokens } from "../../utils/tokenSPL";

export default function TransferTokenPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async (
    mintAddress: string,
    recipient: string,
    amount: string
  ) => {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const amountNumber = parseFloat(amount);
      const mintPublicKey = new PublicKey(mintAddress);
      const recipientPublicKey = new PublicKey(recipient);

      const tx = await transferTokens(
        connection,
        mintPublicKey,
        wallet.publicKey,
        wallet.publicKey,
        recipientPublicKey,
        amountNumber
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = blockhash;

      const txSignature = await wallet.sendTransaction(tx, connection);

      await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      });

      setSuccess("Transfer successful!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Transfer Tokens</h1>
      {loading && <p>Processing transfer...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <TransferTokenForm onSubmit={handleTransfer} disabled={loading} />
    </div>
  );
}
