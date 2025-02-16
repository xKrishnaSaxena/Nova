import { useState, useEffect } from "react";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { motion } from "framer-motion";
import { FiCopy, FiPackage, FiSearch } from "react-icons/fi";
import { useWallet } from "@solana/wallet-adapter-react";

const CreatedTokens = ({
  activeSection,
}: {
  activeSection: "solana" | "ethereum";
}) => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) return;

      try {
        setLoading(true);
        setError("");

        const tokens = await new TokenListProvider().resolve();
        const tokenList = tokens.filterByClusterSlug("devnet").getList();
        console.log(tokenList);
        const PASSTOKEN = tokenList.map(
          (token: any) =>
            token.address === "BQNaJFSdVhFtaPpfsZT8NYgxTkTGoXks2aQWTKvVk5JZ"
        );

        console.log(PASSTOKEN);
        const userTokens = tokenList.filter(
          (token: any) =>
            token.extensions?.updateAuthority === publicKey.toBase58()
        );
        console.log(userTokens);
        setTokens(userTokens);
      } catch (err) {
        setError("Failed to fetch tokens. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] pt-24 pb-8 px-8">
        <div className="text-center text-white">
          <div className="text-2xl mb-4">🔒 Wallet Not Connected</div>
          <p className="text-gray-400 max-w-md">
            Please connect your Solana wallet to view your created tokens
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] pt-24 pb-8 px-8">
      <motion.div
        className="absolute top-36 right-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
        animate={{ rotate: [0, 15, -15, 0], y: [-30, 30] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <motion.img
          src={activeSection === "solana" ? "Sol.png" : "Eth.png"}
          className="w-full h-full mt-12 text-purple-500/20"
        />
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Created Tokens
              </h1>
              <p className="text-gray-400 mt-2">
                Manage and view all tokens you've created on Solana
              </p>
            </div>

            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-48 bg-white/5 rounded-xl border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center py-24">
              <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
              <h3 className="text-xl text-gray-300 mb-2">No Tokens Found</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "No matches for your search"
                  : "You haven't created any tokens yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => (
                <motion.div
                  key={token.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.name}
                          className="w-12 h-12 rounded-full bg-white/5 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <FiPackage className="text-2xl text-purple-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{token.name}</h3>
                        <span className="text-sm text-purple-400">
                          {token.symbol}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(token.address)
                      }
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <FiCopy className="text-xl" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Address:</span>
                      <span className="font-mono text-gray-300 truncate max-w-[120px]">
                        {token.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Decimals:</span>
                      <span className="text-gray-300">{token.decimals}</span>
                    </div>
                    {token.extensions?.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Website:</span>
                        <a
                          href={token.extensions.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 truncate max-w-[120px]"
                        >
                          {token.extensions.website}
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreatedTokens;
