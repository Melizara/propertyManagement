import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try {
        const { matricule, email, poste, password } = req.body;

        // Vérifie si l'utilisateur existe déjà par email ou matricule
        const isExists = await User.findOne({
            where: { email }
        });
        if (isExists) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        const isMatriculeExists = await User.findOne({
            where: { matricule }
        });
        if (isMatriculeExists) {
            return res.status(400).json({ message: "Matricule déjà utilisé" });
        }

        // Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Création de l'utilisateur
        const user = await User.create({
            matricule,
            email,
            poste,
            password: hash
        });

        if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY manquant");

        // Génération du token (on utilise matricule comme identifiant)
        const userPlain = user.get({ plain: true });
        const token = jwt.sign({ matricule: userPlain.matricule }, process.env.SECRET_KEY, { expiresIn: "1d" });

        // On retire le mot de passe de la réponse
        const { password: pwd, ...userData } = user.get({ plain: true });

        return res.status(200).json({ userData, token });
    } catch (error) {
        if (error instanceof Error) return res.status(500).json({ error: error.message });
        return res.status(500).json({ message: "Unknown error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { matricule, password } = req.body;

        const user = await User.findByPk(matricule);
        // console.log("Utilisateur trouvé :", user);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        // Vérifie le mot de passe
        const userPlain = user.get({ plain: true });
        const isPasswordValid = await bcrypt.compare(password, userPlain.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }
        // Vérifie que le SECRET_KEY existe
        if (!process.env.SECRET_KEY) {
            throw new Error("Tsy ao ilay SECRET_KEY");
        }
        // Génère un token
        const userPlain2 = user.get({ plain: true });
        const token = jwt.sign({ matricule: userPlain2.matricule }, process.env.SECRET_KEY, { expiresIn: "1d" });
        // Supprime le mot de passe de la réponse
        const { password: pwd, ...userData } = user.get({ plain: true });

        return res.status(200).json({ userData, token });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ message: "Unknown error" });
    }
};

export const account = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.userMatricule);
        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        const { password, ...userData } = user.get({ plain: true });
        return res.status(200).json(userData);
    } catch (error) {
        //Ito mila tadidiana
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
};
