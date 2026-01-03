import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // 🔥 VERY IMPORTANT LINE
    req.user = { id: decoded.userId };

    console.log("✅ AUTH USER ID:", req.user.id);

    next();
  } catch (error) {
    console.error("❌ AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};