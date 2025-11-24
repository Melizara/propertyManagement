import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Ajout de userMatricule à la requête
export interface AuthRequest extends Request {
    userMatricule?: string;
    userPoste?: "caissier" | "admin" | "operateur de saisie";
}

const allowedRoles = ["caissier", "admin", "operateur de saisie"] as const;

export const protectAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Récupère le token depuis le header Authorization
    const token = (req.headers.authorization || "").replace(/^Bearer\s/, "");
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        // Vérification et décodage du token
        const decoded = jwt.verify(token, process.env.SECRET_KEY) as { matricule: string; poste?: string };

        // Stocke le matricule dans la requête
        req.userMatricule = decoded.matricule;
        if (decoded.poste && allowedRoles.includes(decoded.poste as typeof allowedRoles[number])) {
            req.userPoste = decoded.poste as "caissier" | "admin" | "operateur de saisie";
        } else {
            req.userPoste = undefined; // ou null selon ton choix
        }
        next();
    } catch (error) {
        return res.status(403).json({ message: "Not Authorized" });
    }
};
