import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useUser } from "../contexts/userContext";

const Topbar = () => {
  const { user } = useUser();

  return (
    <div className="w-full bg-gray-900 text-white py-3 px-6 flex items-center justify-between shadow-md">
      <h1 className="text-lg font-semibold">NOVA</h1>

      <div className="flex items-center gap-6">
        <span className="hidden md:inline text-sm">
          👤 {user?.username || "Guest"}
        </span>

        <span className="hidden md:inline text-sm truncate w-100">
          🔑 {user?.depositAddress || "No Address"}
        </span>

        <span className="text-sm">💰 {user?.balance ?? 0} ETH</span>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
