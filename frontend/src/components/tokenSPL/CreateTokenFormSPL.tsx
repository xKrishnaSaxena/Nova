// CreateTokenFormSPL.tsx
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FiPenTool, FiHash, FiImage, FiPlus } from "react-icons/fi";

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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
    >
      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiPenTool className="text-lg" />
          Token Name
        </label>
        <input
          type="text"
          placeholder="My Awesome Token"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiHash className="text-lg" />
          Token Symbol
        </label>
        <input
          type="text"
          placeholder="MAT"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
          <FiImage className="text-lg" />
          Image URL
        </label>
        <input
          type="url"
          placeholder="https://example.com/token-image.png"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
      >
        <FiPlus className="text-xl" />
        Create Token
      </motion.button>

      {mintAddress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
        >
          <p className="text-sm text-green-400">
            Token Created Successfully! Address:{" "}
            <span className="font-mono break-all">{mintAddress}</span>
          </p>
        </motion.div>
      )}
    </motion.form>
  );
};

export default CreateTokenFormSPL;
