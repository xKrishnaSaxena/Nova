import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BurnTokenForm from "../../components/tokenSPL/BurnTokenFormSPL";
import { burnTokens } from "../../utils/tokenSPL";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

export default function BurnTokenPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBurn = async (mintAddress: string, amount: string) => {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber)) throw new Error("Invalid burn amount");

      const mintPublicKey = new PublicKey(mintAddress);
      const ata = getAssociatedTokenAddressSync(
        mintPublicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      const tx = await burnTokens(
        connection,
        mintPublicKey,
        ata,
        wallet.publicKey,
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

      setSuccess("Tokens burned successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Burn failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Burn Tokens</h1>
      {loading && <p>Burning tokens...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <BurnTokenForm onSubmit={handleBurn} disabled={loading} />
    </div>
  );
}
