import { motion } from "framer-motion";
import {
  FiShuffle,
  FiDroplet,
  FiAnchor,
  FiLock,
  FiBox,
  FiChevronRight,
} from "react-icons/fi";

import { TfiWallet } from "react-icons/tfi";

export default function Home({
  activeSection,
}: {
  activeSection: "solana" | "ethereum";
}) {
  const features = [
    {
      icon: TfiWallet,
      title: "Cross-Chain Wallets",
      desc: "Connect ETH/SOL extension wallets seamlessly",
    },
    {
      icon: FiShuffle,
      title: "Swap Tokens",
      desc: "Instant token swaps between blockchain assets",
    },
    {
      icon: FiDroplet,
      title: "Liquidity Pools",
      desc: "Create & provide liquidity to pools effortlessly",
    },
    {
      icon: FiAnchor,
      title: "Token Management",
      desc: "Mint, burn & transfer SPL/ERC20 tokens",
    },
    {
      icon: FiLock,
      title: "Secure Transactions",
      desc: "Manage authorities & permissions securely",
    },
    {
      icon: FiBox,
      title: "Asset Management",
      desc: "Deposit/Withdraw ETH & SOL with one click",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] text-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative h-screen flex items-center">
        <motion.div
          className="absolute top-12 right-20 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
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

        <motion.div
          className="absolute bottom-16 left-16 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
          animate={{ rotate: [0, -15, 15, 0], y: [30, -30] }}
          transition={{
            rotate: { duration: 8, repeat: Infinity },
            y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
          }}
        >
          <motion.img
            src={activeSection === "solana" ? "Sol.png" : "Eth.png"}
            className="w-full h-full text-purple-500/20"
          />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            Nova
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 mt-6"
          >
            Multi-Chain DeFi Management Platform
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <TfiWallet className="text-xl" />
              Launch App
              <FiChevronRight className="ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-gradient-to-br from-[#1a1a1a]/50 to-[#0e0e0e]/50 rounded-2xl border border-white/5 backdrop-blur-xl hover:border-purple-500/30 transition-all group"
            >
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg w-max mb-6">
                <feature.icon className="text-3xl text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-12 rounded-3xl text-center border border-white/5 backdrop-blur-xl"
        >
          <h2 className="text-3xl font-bold mb-6">
            Start Your DeFi Journey Today
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Connect Wallet
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
