import { RequestHandler } from "express";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { User } from "../models/User";
import { HDNodeWallet } from "ethers";
import { encrypt } from "../utils/crypto";
import { Keypair } from "@solana/web3.js";

export const generateDepositAddress: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.ethDepositAddress && user.solDepositAddress) {
      res.status(200).json({
        message: "Deposit addresses already created!",
        ethAddress: user.ethDepositAddress,
        solAddress: user.solDepositAddress,
      });
      return;
    }
    const mnemonicGenerated = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonicGenerated);
    const userCount = await User.countDocuments();
    const ethWallet = HDNodeWallet.fromSeed(seed);
    const ethDerivePath = `m/44'/60'/${userCount}'/0`;
    const ethNode = ethWallet.derivePath(ethDerivePath);
    const seedUint8 = new Uint8Array(seed.buffer, 0, 32);
    const solanaKeypair = Keypair.fromSeed(seedUint8);
    const solanaPublicKey = solanaKeypair.publicKey.toString();
    const secretKeyHex = Buffer.from(solanaKeypair.secretKey).toString("hex");
    const ethPrivateKey = encrypt(ethNode.privateKey);
    const solPrivateKey = encrypt(secretKeyHex);

    user.ethPrivateKey = ethPrivateKey;
    user.ethDepositAddress = ethNode.address;
    user.solPrivateKey = solPrivateKey;
    user.solDepositAddress = solanaPublicKey;

    await user.save();

    res.status(200).json({
      ethAddress: user.ethDepositAddress,
      solAddress: user.solDepositAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
