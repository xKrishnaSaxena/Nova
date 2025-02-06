import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AuthorityType } from "@solana/spl-token";
import { createAuthorityTransaction } from "../../utils/tokenSPL";
import ManageAuthorityForm from "../../components/tokenSPL/ManageAuthorityFormSPL";

export default function ManageAuthorityPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleManage = async (
    mintAddress: string,
    authorityType: AuthorityType,
    newAuthority: string | ""
  ) => {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.sendTransaction
    ) {
      setError("Wallet not connected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const mintPublicKey = new PublicKey(mintAddress);
      const newAuthorityPublicKey = newAuthority
        ? new PublicKey(newAuthority)
        : null;

      const transaction = createAuthorityTransaction(
        mintPublicKey,
        wallet.publicKey,
        newAuthorityPublicKey,
        authorityType
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTx = await wallet.signTransaction(transaction);
      const txSignature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      });

      setSuccess("Authority updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update authority"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Manage Token Authorities</h1>
      <div className="status-container">
        {loading && (
          <div className="loading-indicator">Processing transaction...</div>
        )}
        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}
      </div>
      <ManageAuthorityForm onSubmit={handleManage} disabled={loading} />
    </div>
  );
}
