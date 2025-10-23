import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try {
        //Jerena rah efa misy io utilisateur io
        const isExists = await User.findOne({
            where: { email: req.body.email }
        })
        if (isExists) {
            return res.status(400).json({
                message: "Efa misy io compte io"
            })
        }
        //Hashena ilay mdp amzay tsy de mora hita
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        //Micreer anle utilisateur(requete)
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })
        //Misy ve ilay SECRET_KEY ary amin'ny .env
        if (!process.env.SECRET_KEY) {
            throw new Error("Tsy ao ilay SECRET_KEY");
        }
        //Generation anle token
        const token = jwt.sign(
            { id: (user as any).id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        )

        //Alaina ary amin'ny reponse ny password
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
        console.log("Body reçu :", req.body); // <-- vérifie email et password
        const { email, password } = req.body;

        // Vérifie si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        console.log("Utilisateur trouvé :", user);
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
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
        const token = jwt.sign(
            { id: (user as any).id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        )


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
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        /*
        //Ito zao erreur am ts
        const { password, ...userData } = user._doc;
        */
        //Ito no solution any
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

