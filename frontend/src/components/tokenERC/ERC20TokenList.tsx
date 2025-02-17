import { useState, useEffect } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { motion } from "framer-motion";
import { FiCopy, FiPackage, FiSearch } from "react-icons/fi";
import { useAccount } from "wagmi";

const POPULAR_TOKEN_ADDRESSES = [
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", // MATIC
  "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
  "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", // MKR
  "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F", // GTC
  "0x3845badAde8e6dFF049820680d1F14bD3903a5d0", // SAND
  "0x4d224452801ACEd8B2F0aebE155379bb5D594381", // APE
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // AAVE
  "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", // BAT
  "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39", // HEX
  "0xD533a949740bb3306d119CC777fa900bA034cd52", // CRV
  "0x4E15361FD6b4BB609Fa63C81A2be19d873717870", // FTM
  "0x6c6EE5e31d828De241282B9606C8e98Ea48526E2", // HOT
  "0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b", // AXS
  "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA", // GALA
];

const CreatedTokensERC = ({
  activeSection,
}: {
  activeSection: "solana" | "ethereum";
}) => {
  const { address } = useAccount();
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([]);
  const [publicTokens, setPublicTokens] = useState<TokenInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function fetchUserTokenBalances(address?: string): Promise<string[]> {
    if (!address) return [];

    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=asc&apikey=RBHH55KXHWQHANXZ2STT66QFP2V1MZ72N2`
      );

      const data = await response.json();
      return Array.from(
        new Set(data.result.map((tx: any) => tx.contractAddress.toLowerCase()))
      );
    } catch (error) {
      console.error("Error fetching token balances:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://tokens.uniswap.org/");
        const data = await response.json();
        const mainnetTokens: TokenInfo[] = data.tokens;

        const userTokenAddresses = await fetchUserTokenBalances(address); // Implement this
        const userTokens = address
          ? mainnetTokens.filter((token) =>
              userTokenAddresses.includes(token.address.toLowerCase())
            )
          : [];

        const popularTokens = mainnetTokens
          .filter((token: TokenInfo) =>
            POPULAR_TOKEN_ADDRESSES.includes(token.address)
          )
          .slice(0, 100);

        setUserTokens(userTokens);
        setPublicTokens(popularTokens);
      } catch (err) {
        setError("Failed to fetch tokens. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address]);

  const filteredUserTokens = userTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublicTokens = publicTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          src={activeSection === "ethereum" ? "Eth.png" : "Sol.png"}
          className="w-full h-full mt-12 text-blue-500/20"
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Ethereum Token Explorer
              </h1>
              <p className="text-gray-400 mt-2">
                {address
                  ? "Manage your tokens and explore the network"
                  : "Explore ERC20 tokens on Ethereum network"}
              </p>
            </div>

            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
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
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-48 bg-white/5 rounded-xl border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {address && (
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                    Your Tokens
                  </h2>
                  {filteredUserTokens.length === 0 ? (
                    <div className="text-center py-12">
                      <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
                      <h3 className="text-xl text-gray-300 mb-2">
                        No Tokens Found
                      </h3>
                      <p className="text-gray-500">
                        {searchQuery
                          ? "No matches for your search"
                          : "You don't hold any ERC20 tokens"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredUserTokens.map((token) => (
                        <TokenCard key={token.address} token={token} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                  Popular ERC20 Tokens
                </h2>
                {filteredPublicTokens.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl text-gray-300 mb-2">
                      No Tokens Found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No matches for your search"
                        : "Failed to load popular tokens"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublicTokens.map((token) => (
                      <TokenCard key={token.address} token={token} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const TokenCard = ({ token }: { token: TokenInfo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all"
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
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <FiPackage className="text-2xl text-blue-400" />
          </div>
        )}
        <div>
          <h3 className="font-semibold">{token.name}</h3>
          <span className="text-sm text-blue-400">{token.symbol}</span>
        </div>
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(token.address)}
        className="text-gray-400 hover:text-blue-400 transition-colors"
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
            //@ts-ignore
            href={token.extensions.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 truncate max-w-[120px]"
          >
            {/*@ts-ignore*/}
            {token.extensions.website}
          </a>
        </div>
      )}
    </div>
  </motion.div>
);

export default CreatedTokensERC;
