import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype;
    }
  }
}

export const protect: RequestHandler = async (req, res, next) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token" }) as unknown as void;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found" }) as unknown as void;
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, token failed" }) as unknown as void;
  }
};
