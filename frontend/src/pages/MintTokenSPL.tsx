import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { mintToAddress } from "../utils/token";
import MintTokenFormSPL from "../components/token/MintTokenFormSPL";

export default function MintTokenPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleMintToken = async (
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
      if (isNaN(amountNumber)) throw new Error("Invalid mint amount");

      const mintPublicKey = new PublicKey(mintAddress);
      const recipientPublicKey = new PublicKey(recipient);

      const transaction = await mintToAddress(
        connection,
        mintPublicKey,
        wallet.publicKey,
        recipientPublicKey,
        amountNumber
      );

      transaction.feePayer = wallet.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const txSignature = await wallet.sendTransaction(transaction, connection);

      const { lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      });

      setSuccess("Tokens minted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint tokens");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Mint Existing Token</h1>
      {loading && <p>Minting tokens...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <MintTokenFormSPL onMint={handleMintToken} />
    </div>
  );
}
