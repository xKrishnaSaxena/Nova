import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.ethDepositAddress || !user.solDepositAddress) {
      res.status(200).json({
        username: user.username,
        ethDepositAddress: "",
        ethbalance: user.ethBalance,
        solDepositAddress: "",
        solBalance: user.solBalance,
      });
      return;
    }

    res.status(200).json({
      username: user.username,
      ethDepositAddress: user.ethDepositAddress,
      solDepositAddress: user.solDepositAddress,
      ethBalance: user.ethBalance,
      solBalance: user.solBalance,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
