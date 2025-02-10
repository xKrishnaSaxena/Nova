import { useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiLock,
  FiMail,
  FiLogIn,
  FiUserPlus,
  FiGithub,
  FiTwitter,
} from "react-icons/fi";
import { AiFillGoogleCircle } from "react-icons/ai";

const Login = ({ activeSection }: { activeSection: "solana" | "ethereum" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { login } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center justify-center p-4">
      <motion.div
        className="absolute top-12 right-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
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
        className="absolute bottom-16 left-64 size-48 lg:size-60 xl:size-72 z-0 opacity-30"
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
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleLogin}
        className="text-white w-full max-w-md bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
          >
            Welcome Back
          </motion.h2>
          <p className="text-gray-400">Access your Nova account</p>
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

        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <FiMail className="text-lg" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
              <FiLock className="text-lg" />
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-600"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            <FiLogIn className="text-xl" />
            Sign In
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1a1a1a] text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <AiFillGoogleCircle className="text-xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <FiGithub className="text-xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <FiTwitter className="text-xl" />
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
