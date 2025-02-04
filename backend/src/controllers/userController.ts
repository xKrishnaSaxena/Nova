import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.depositAddress) {
      res.status(200).json({
        username: user.username,
        depositAddress: "",
        balance: user.balance,
      });
    }

    res.status(200).json({
      username: user.username,
      depositAddress: user.depositAddress,
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
