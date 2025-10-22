import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const protectAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || "").replace(/^Bearer\s/, "");

    if (token) {
        try {
            if (!process.env.SECRET_KEY) {
                throw new Error("SECRET_KEY is not defined in environment variables");
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY) as { _id: string };
            
            req.userId = decoded._id;
            next();
        } catch (error) {
            return res.status(403).json({
                message: "Not Authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "No token"
        })
    }
}

