import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const isExists = await User.findOne({ email: req.body.email });
        if (isExists) {
            return res.status(400).json({
                message: "already have an account"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const doc = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        const user = await doc.save();

        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        const userObj = user.toObject();
        const { password, ...userData } = userObj;

        return res.status(200).json({ userData, token });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ message: "Unknown error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            return res.sendStatus(404).json({
                message: "User not found"
            })
        }

        const isValidPw = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPw) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        } else {
            if (!process.env.SECRET_KEY) {
                throw new Error("SECRET_KEY is not defined in environment variables");
            }
            const token = jwt.sign(
                { _id: user._id },
                process.env.SECRET_KEY,
                { expiresIn: "1d" }
            );

            const userObj = user.toObject();
            const { password, ...userData } = userObj;

            return res.status(200).json({ userData, token });
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        }
        return res.status(500).json({ message: "Unknown error" });
    }
};

export const account = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        /*
        //Ito zao erreur am ts
        const { password, ...userData } = user._doc;
        */
        //Ito no solution any
        const userObj = user.toObject();
        const { password, ...userData } = userObj;

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

