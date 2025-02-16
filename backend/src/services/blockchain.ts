import { JsonRpcProvider, Wallet, isAddress, parseEther } from "ethers";
import { decrypt } from "../utils/crypto";
import config from "../utils/config";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
const BLOCKCHAIN_RPC_URL = config.BLOCKCHAIN_RPC_URL;
const provider = new JsonRpcProvider(BLOCKCHAIN_RPC_URL);
const SOLANA_RPC_URL = config.SOLANA_RPC_URL;
const connection = new Connection(SOLANA_RPC_URL);
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
export async function sendSolanaTransaction(
  encryptedPrivateKey: string,
  fromAddress: string,
  toAddress: string,
  amount: number
) {
  try {
    const decryptedKey = decrypt(encryptedPrivateKey);
    const keypair = Keypair.fromSecretKey(Buffer.from(decryptedKey, "hex"));

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: keypair.publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: new PublicKey(toAddress),
            lamports: Math.round(amount * LAMPORTS_PER_SOL),
          }),
        ],
      }).compileToV0Message()
    );

    transaction.sign([keypair]);
    const txid = await connection.sendTransaction(transaction);
    return txid;
  } catch (error) {
    console.error("Solana transaction error:", error);
    throw error;
  }
}
