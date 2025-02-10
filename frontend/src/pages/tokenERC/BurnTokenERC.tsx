import { motion } from "framer-motion";

import BurnTokensForm from "../../components/tokenERC/ERC20BurnTokenForm";

const TransferPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center text-white justify-center p-4">
      <motion.div
        className="absolute top-12 right-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
        animate={{ rotate: [0, -15, 15, 0], y: [-30, 30] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          y: { duration: 4, repeat: Infinity, repeatType: "mirror" },
        }}
      >
        <motion.img
          src="/Eth.png"
          className="w-full h-full mt-12 text-blue-500/20"
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <BurnTokensForm />
        </motion.div>
      </div>
    </div>
  );
};

export default TransferPage;
