import { FC, useState } from "react";
import { AuthorityType } from "@solana/spl-token";

interface ManageAuthorityFormProps {
  onSubmit: (
    mintAddress: string,
    authorityType: AuthorityType,
    newAuthority: string
  ) => Promise<void>;
  disabled?: boolean;
}

const ManageAuthorityForm: FC<ManageAuthorityFormProps> = ({
  onSubmit,
  disabled,
}) => {
  const [mintAddress, setMintAddress] = useState("");
  const [authorityType, setAuthorityType] = useState<AuthorityType>(
    AuthorityType.MintTokens
  );
  const [newAuthority, setNewAuthority] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(mintAddress, authorityType, newAuthority.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="authority-form">
      <div className="form-group">
        <label>Token Mint Address:</label>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          disabled={disabled}
          placeholder="Enter token mint address"
        />
      </div>

      <div className="form-group">
        <label>Authority Type:</label>
        <select
          value={authorityType}
          onChange={(e) =>
            setAuthorityType(parseInt(e.target.value, 10) as AuthorityType)
          }
          disabled={disabled}
        >
          <option value={AuthorityType.MintTokens}>Mint Authority</option>
          <option value={AuthorityType.FreezeAccount}>Freeze Authority</option>
        </select>
      </div>

      <div className="form-group">
        <label>New Authority Address (leave empty to revoke):</label>
        <input
          type="text"
          value={newAuthority}
          onChange={(e) => setNewAuthority(e.target.value)}
          disabled={disabled}
          placeholder="Enter new authority address"
        />
      </div>

      <button type="submit" disabled={disabled} className="action-button">
        {disabled ? "Processing..." : "Update Authority"}
      </button>
    </form>
  );
};

export default ManageAuthorityForm;
