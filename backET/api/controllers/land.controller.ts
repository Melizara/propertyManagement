import type { Request, Response } from "express";
import { Land } from "../models/land.model.ts";
import { User } from "../models/user.model.ts";

export const createLand = async (req: Request, res: Response) => {
    try {
        if (!req.userMatricule) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const land = await Land.create({
            length: req.body.length,
            width: req.body.width,
            area: req.body.length * req.body.width,
            startPk: req.body.startPk,
            endPk: req.body.endPk,
            railwaySide: req.body.railwaySide,
            position: req.body.position,
            neighborHood: req.body.neighborHood,
            municipality: req.body.municipality,
            userMatricule: req.body.userMatricule!
        });
        return res.status(201).json(land);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const updateLand = async (req: Request, res: Response) => {
    try {
        const land = await Land.findByPk(req.params.codeLand);

        if (!land) {
            return res.status(404).json({ message: "not found land to update" });
        }

        await land.update({
            length: req.body.length,
            width: req.body.width,
            area: req.body.length * req.body.width,
            startPk: req.body.startPk,
            endPk: req.body.endPk,
            railwaySide: req.body.railwaySide,
            position: req.body.position,
            neighborHood: req.body.neighborHood,
            municipality: req.body.municipality,
            userMatricule: req.body.userMatricule!
        });

        return res.status(200).json(land);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const deleteLand = async (req: Request, res: Response) => {
    try {
        const land = await Land.findByPk(req.params.codeLand);

        if (!land) {
            return res.status(404).json({ message: "not found land to update" });
        }

        await land.destroy();
        return res.status(200).json(land);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const getLand = async (req: Request, res: Response) => {
    try {
        const landId = req.params.codeLand;

        const land = await Land.findByPk(landId, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["matricule", "pseudo", "email"]
                },
            ]
        });
        if (!land) {
            return res.status(404).json({ message: "Terrain pas trouve" });
        };

        await land.save();
        return res.status(200).json(land);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const getLands = async (req: Request, res: Response) => {
    try {
        const lands = await Land.findAll({
            order: [["codeLand", "DESC"]],
            include: [{ association: "user", attributes: { exclude: ["password"] } }],
        });

        return res.status(200).json(lands);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
