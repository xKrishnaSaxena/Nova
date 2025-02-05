import { JsonRpcProvider, Wallet, isAddress, parseEther } from "ethers";
import { decrypt } from "../utils/crypto";
import config from "../utils/config";

const BLOCKCHAIN_RPC_URL = config.BLOCKCHAIN_RPC_URL;
const provider = new JsonRpcProvider(BLOCKCHAIN_RPC_URL);

export async function sendTransaction(
  privateKey: string,
  fromAddress: string,
  toAddress: string,
  amount: number
) {
  try {
    const decryptedKey = decrypt(privateKey);

    const wallet = new Wallet(decryptedKey, provider);

    if (!isAddress(fromAddress) || !isAddress(toAddress)) {
      throw new Error("Invalid Ethereum address");
    }

    const value = parseEther(amount.toString());
    const price = (await provider.getFeeData()).gasPrice;
    const tx = {
      from: fromAddress,
      to: toAddress,
      value,
      gasLimit: 21000,
      gasPrice: price,
    };

    const transaction = await wallet.sendTransaction(tx);
    return transaction.hash;
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
}
