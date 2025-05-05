import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.header("Authorization") || "";

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (user) {
      // @ts-ignore
      req.userId = user.id;
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: "Invalid token"
    });
  }
}; 