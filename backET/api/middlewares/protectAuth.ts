import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Étendre Request pour inclure userId comme string
export interface AuthRequest extends Request {
    userId?: string;
}

export const protectAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || "").replace(/^Bearer\s/, "");

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        // Vérifie le token
        const decoded = jwt.verify(token, process.env.SECRET_KEY) as { id: string | number };

        // Convertit en string pour éviter l'erreur TS
        req.userId = decoded.id.toString();

        next();
    } catch (error) {
        return res.status(403).json({ message: "Not Authorized" });
    }
};
