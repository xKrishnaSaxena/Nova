import { Request, Response } from "express";
import { Withdrawal } from "./../models/withdrawal";
import { sendTransaction } from "../services/blockchain";

export const initiateWithdrawal = async (req: Request, res: Response) => {
  try {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({ message: "Invalid amount" });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (user.balance < amount) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }

    if (!user.depositAddress || !user.privateKey) {
      res.status(400).json({ message: "User wallet not configured" });
      return;
    }

    const withdrawal = new Withdrawal({
      user: user._id,
      amount,
      fromAddress: user.depositAddress,
      toAddress,
      status: "pending",
      txHash: "pending-" + Date.now(),
    });

    await withdrawal.save();

    try {
      const txHash = await sendTransaction(
        user.privateKey,
        user.depositAddress,
        toAddress,
        amount
      );
      withdrawal.txHash = txHash;
      await withdrawal.save();
      res.status(201).json(withdrawal);
    } catch (error) {
      withdrawal.status = "failed";

      await withdrawal.save();

      console.error("Transaction submission error:", error);
      res.status(500).json({ message: "Failed to submit transaction" });
    }
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ message: "Server error during withdrawal" });
  }
};
