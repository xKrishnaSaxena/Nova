import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { createToken } from "../utils/token";
import CreateTokenFormSPL from "../components/token/CreateTokenFormSPL";

export default function CreateTokenPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [mintAddress, setMintAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateToken = async (
    name: string,
    symbol: string,
    image: string,
    supply: string
  ) => {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const supplyNumber = parseFloat(supply);
      if (isNaN(supplyNumber)) throw new Error("Invalid supply amount");

      const { mintKeypair, transaction } = await createToken(
        connection,
        wallet.publicKey,
        name,
        symbol,
        image,
        supplyNumber
      );

      transaction.feePayer = wallet.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const txSignature = await wallet.sendTransaction(
        transaction,
        connection,
        {
          signers: [mintKeypair],
        }
      );

      const { lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      });

      setMintAddress(mintKeypair.publicKey.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Create New Token</h1>
      {loading && <p>Creating token...</p>}
      {error && <p className="error">{error}</p>}
      <CreateTokenFormSPL
        onCreate={handleCreateToken}
        mintAddress={mintAddress}
      />
    </div>
  );
}
