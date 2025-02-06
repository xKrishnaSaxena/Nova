import { FC, useState } from "react";

interface CreateTokenFormProps {
  onCreate: (name: string, symbol: string, image: string) => Promise<void>;
  mintAddress?: string;
}

const CreateTokenFormSPL: FC<CreateTokenFormProps> = ({
  onCreate,
  mintAddress,
}) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(name, symbol, image);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="url"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button type="submit">Create Token</button>
      {mintAddress && (
        <div className="mint-address">
          <p>Token Created: {mintAddress}</p>
        </div>
      )}
    </form>
  );
};

export default CreateTokenFormSPL;
