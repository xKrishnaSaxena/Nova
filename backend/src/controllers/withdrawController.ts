import { Request, Response } from "express";
import { Withdrawal } from "./../models/withdrawal";
import { sendSolanaTransaction, sendTransaction } from "../services/blockchain";

export const initiateWithdrawal = async (req: Request, res: Response) => {
  try {
    const { toAddress, amount, currency } = req.body;

    if (!currency || !["ETH", "SOL"].includes(currency)) {
      res.status(400).json({ message: "Invalid currency" });
      return;
    }

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
    const balanceField = `${currency.toLowerCase()}Balance`;
    if (user[balanceField] < amount) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }

    const addressField = `${currency.toLowerCase()}DepositAddress`;
    const privateKeyField = `${currency.toLowerCase()}PrivateKey`;
    if (!user[addressField] || !user[privateKeyField]) {
      res.status(400).json({ message: "Wallet not configured" });
      return;
    }

    const withdrawal = new Withdrawal({
      user: user._id,
      amount,
      currency,
      fromAddress: user[addressField],
      toAddress,
      status: "pending",
      txHash: "pending-" + Date.now(),
    });

    await withdrawal.save();

    try {
      let txHash;
      if (currency === "ETH") {
        txHash = await sendTransaction(
          user[privateKeyField],
          user[addressField],
          toAddress,
          amount
        );
      } else {
        txHash = await sendSolanaTransaction(
          user[privateKeyField],
          user[addressField],
          toAddress,
          amount
        );
      }

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
