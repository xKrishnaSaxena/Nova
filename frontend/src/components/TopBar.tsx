import { Dispatch, SetStateAction } from "react";
import { useUser } from "../contexts/userContext";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

interface TopbarProps {
  isEthereum: boolean;
  setIsEthereum: Dispatch<SetStateAction<boolean>>;
}

const Topbar: React.FC<TopbarProps> = ({ isEthereum, setIsEthereum }) => {
  const { user } = useUser();

  const ethAccount = isEthereum ? useAccount() : null;
  const ethConnect = isEthereum ? useConnect() : null;
  const ethDisconnect = isEthereum ? useDisconnect() : null;

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
        <span className="text-sm">
          💰 {user?.balance ?? 0} {isEthereum ? "ETH" : "SOL"}
        </span>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setIsEthereum(!isEthereum)}
        >
          Switch to {isEthereum ? "Solana" : "Ethereum"}
        </button>

        {isEthereum ? (
          ethAccount?.isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">
                🔗 {ethAccount.address?.slice(0, 6)}...
                {ethAccount.address?.slice(-4)}
              </span>
              <button
                className="px-3 py-2 bg-red-500 text-white rounded-md"
                onClick={() => ethDisconnect?.disconnect()}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="px-3 py-2 bg-green-500 text-white rounded-md"
              onClick={() =>
                ethConnect?.connect({ connector: ethConnect?.connectors[0] })
              }
            >
              Connect Ethereum Wallet
            </button>
          )
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Topbar;
