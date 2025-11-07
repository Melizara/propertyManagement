import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../middlewares/protectAuth.ts";


export const register = async (req: Request, res: Response) => {
    try {
        //Verification sao dia efa misy anaty DB io User ajoutena io
        //Requete ity,mitovy amin'ny hoe SELECT...WHERE
        //Ilay 'req.body.email' io ilay valeur envoyena avy any postman na frontend
        const isExists = await User.findOne({
            where: { email: req.body.email }
        })
        if (isExists) {
            return res.status(400).json({
                message: "Utilisateur deja existant"
            })
        }
        //Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);//Creer un 'salt' qui est une serie de nombre aleatoir
        const hash = await bcrypt.hash(req.body.password, salt);//Combinena eto ilay mdp sy salt

        //Requete pour creer un utilisateur
        const user = await User.create({
            matricule: req.body.matricule,
            poste: req.body.poste,
            email: req.body.email,
            password: hash
        })
        //Verification si le SECRET_KEY existe dans le .env
        if (!process.env.SECRET_KEY) {
            throw new Error("Tsy ao ilay SECRET_KEY");
        }
        //Generation anle token
        const token = jwt.sign(
            { matricule: user.matricule },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );


        //Fomba atao mba tsy i-affichena ny mdp any am'ny reponse JSON
        const { password, ...userData } = user.get({ plain: true });

        return res.status(200).json({ userData, token })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ message: "Unknown error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { matricule, password } = req.body;

        const user = await User.findOne({ where: { matricule } });
        // console.log("Utilisateur trouvé :", user);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        // Vérifie le mot de passe
        const userPlain = user.get({ plain: true });
        const isPasswordValid = await bcrypt.compare(password, userPlain.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Matricule ou mot de passe incorrect" });
        }
        // Vérifie que le SECRET_KEY existe
        if (!process.env.SECRET_KEY) {
            throw new Error("Tsy ao ilay SECRET_KEY");
        }
        // Génère un token
        const token = jwt.sign(
            { matricule: user.matricule },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

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

export const account = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.userId); // req.userId contient maintenant le matricule
        console.log("User matricule récupéré :", req.userId);
        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        const { password, ...userData } = user.get({ plain: true });
        return res.status(200).json(userData);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
};
