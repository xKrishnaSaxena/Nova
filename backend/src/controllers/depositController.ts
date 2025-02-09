import { RequestHandler } from "express";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { User } from "../models/User";
import { HDNodeWallet } from "ethers";

export const generateDepositAddress: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.depositAddress) {
      res.status(200).json({
        message: "Deposit address already created!",
        depositAddress: user.depositAddress,
      });
      return;
    }
    const mnemonicGenerated = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonicGenerated);
    const userCount = await User.countDocuments();

    const wallet = HDNodeWallet.fromSeed(seed);
    const derivePath = `m/44'/60'/${userCount}'/0`;
    const node = wallet.derivePath(derivePath);

    user.privateKey = node.privateKey;
    user.depositAddress = node.address.toLowerCase();

    await user.save();

    res.status(200).json({
      depositAddress: user.depositAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
