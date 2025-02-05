import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { encrypt } from "../utils/crypto";

export interface IUser {
  username: string;
  email: string;
  password: string;
  depositAddress: string;
  privateKey: string;
  balance: number;
}

interface UserDocument extends IUser, mongoose.Document {
  comparePassword(password: string): Promise<boolean>;
  comparePrivateKey(privateKey: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  depositAddress: {
    type: String,
    default: "",
  },
  privateKey: {
    type: String,
    default: "",
  },
  balance: {
    type: Number,
    default: 0,
  },
});

UserSchema.pre<UserDocument>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("privateKey") && this.privateKey) {
    this.privateKey = encrypt(this.privateKey);
  }
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<UserDocument>("User", UserSchema);
