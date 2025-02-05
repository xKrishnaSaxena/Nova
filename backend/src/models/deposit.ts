import mongoose, { Schema } from "mongoose";

export interface IDeposit {
  user: mongoose.Types.ObjectId;
  txHash: string;
  amount: number;
  status: "pending" | "confirmed";
  createdAt: Date;
  confirmedAt?: Date;
  toAddress: string;
}

interface DepositDocument extends IDeposit, mongoose.Document {}

const DepositSchema = new Schema<DepositDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    txHash: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
    toAddress: { type: String, required: true },
    confirmedAt: Date,
  },
  { timestamps: true }
);

DepositSchema.index({ user: 1 });
DepositSchema.index({ txHash: 1 });
DepositSchema.index({ status: 1 });

export const Deposit = mongoose.model<DepositDocument>(
  "Deposit",
  DepositSchema
);
