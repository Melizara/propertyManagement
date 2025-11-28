// Import des types pour Express
import type { Request, Response } from "express";
// Import du modèle User (base de données)
import { User } from "../models/user.model.ts";
// Import pour hasher le mot de passe
import bcrypt from "bcrypt";
// Import pour créer des tokens JWT
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// ===============================
// Fonction pour l'inscription
// ===============================
export const register = async (req: Request, res: Response) => {
    try {
        // Récupère les infos envoyées par le client
        const { matricule, pseudo, email, poste, password } = req.body;
        // Vérifie si un utilisateur existe déjà avec cet email
        const isExists = await User.findOne({ where: { email } });
        if (isExists) {
            return res.status(401).json({ message: "Email déjà existant" });
        }
        // Vérifie si le matricule est déjà utilisé
        const isMatriculeExists = await User.findOne({ where: { matricule } });
        if (isMatriculeExists) {
            return res.status(400).json({ message: "Matricule déjà utilisé" });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Renvoie un tableau d'erreurs
            return res.status(400).json({ errors: errors.array() });
        }
        // Hashage du mot de passe pour plus de sécurité
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        // Création de l'utilisateur dans la base de données
        const user = await User.create({
            matricule,
            pseudo,
            email,
            poste,
            password: hash
        });
        // Vérifie que la clé secrète pour JWT existe
        if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY manquant");
        // Génération du token JWT avec le matricule et le poste
        const userPlain = user.get({ plain: true }); // récupère les données en objet simple
        const token = jwt.sign(
            { matricule: userPlain.matricule, poste: userPlain.poste },
            process.env.SECRET_KEY,
            { expiresIn: "1d" } // token valable 1 jour
        );
        // Supprime le mot de passe avant de renvoyer la réponse
        const { password: pwd, ...userData } = user.get({ plain: true });
        // Renvoie l'utilisateur et le token
        return res.status(200).json({ userData, token });
    } catch (error) {
        // Gestion des erreurs
        if (error instanceof Error) return res.status(500).json({ error: error.message });
        return res.status(500).json({ message: "Unknown error" });
    }
};

// ===============================
// Fonction pour la connexion
// ===============================
export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { matricule, password } = req.body; // récupère matricule et password
        // Cherche l'utilisateur par son matricule
        const user = await User.findByPk(matricule);
        if (!user) {
            return res.status(404).json({ field: "matricule", message: "Matricule introuvable" });
        }
        // Vérifie le mot de passe
        const userPlain = user.get({ plain: true });
        const isPasswordValid = await bcrypt.compare(password, userPlain.password);
        if (!isPasswordValid) {
            return res.status(400).json({ field: "password", message: "Mot de passe incorrect" });
        }
        // Vérifie que la clé secrète existe pour JWT
        if (!process.env.SECRET_KEY) throw new Error("Tsy ao ilay SECRET_KEY");
        // Génération du token JWT
        const userPlain2 = user.get({ plain: true });
        const token = jwt.sign(
            { matricule: userPlain2.matricule, poste: userPlain2.poste },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );
        // Supprime le mot de passe avant de renvoyer la réponse
        const { password: pwd, ...userData } = user.get({ plain: true });
        // Renvoie l'utilisateur et le token
        return res.status(200).json({ userData, token });
    } catch (error) {
        if (error instanceof Error) return res.status(500).json({ error: error.message });
        return res.status(500).json({ message: "Unknown error" });
    }
};

// ===============================
// Fonction pour récupérer les infos du compte
// ===============================
export const account = async (req: Request, res: Response) => {
    try {
        // Cherche l'utilisateur par le matricule stocké dans req (déjà extrait du token)
        const user = await User.findByPk(req.userMatricule);
        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        // Supprime le mot de passe avant de renvoyer la réponse
        const { password, ...userData } = user.get({ plain: true });
        return res.status(200).json(userData);
    } catch (error) {
        // Gestion des erreurs
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
