import type { Request, Response } from "express";
import { Land } from "../models/land.model.ts";
import { User } from "../models/user.model.ts";
import { Station } from "../models/station.model.ts";
import { Op } from "sequelize";
import { logActivity } from "../middlewares/activityLogs.ts";

export const createLand = async (req: Request, res: Response) => {
    try {
        if (!req.userMatricule) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const stations = await Station.findAll() as unknown as Array<{
            codeStation: number;
            name: string;
            type: string;
            startPk: number;
            endPk: number;
        }>;

        const station = stations.find(s =>
            req.body.startPk >= s.startPk && req.body.endPk <= s.endPk
        );

        if (!station) {
            return res.status(400).json({ message: "Aucune gare correspondante pour ce terrain" });
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
            userMatricule: req.body.userMatricule!,
            codeStation: station.codeStation,
        });

        if (land.codeLand !== undefined) {
            await logActivity(req.userMatricule!, "CREATE", "Land", land.codeLand.toString());
        }

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

        const stations = await Station.findAll() as unknown as Array<{
            codeStation: number;
            name: string;
            type: string;
            startPk: number;
            endPk: number;
        }>;

        const station = stations.find(s =>
            req.body.startPk >= s.startPk && req.body.endPk <= s.endPk
        );

        if (!station) {
            return res.status(400).json({ message: "Aucune gare correspondante pour ce terrain" });
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
            userMatricule: req.body.userMatricule!,
            codeStation: station.codeStation
        });
        if (land.codeLand !== undefined) {
            await logActivity(req.userMatricule!, "UPDATE", "Land", land.codeLand.toString());
        }

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

        if (land.codeLand !== undefined) {
            await logActivity(req.userMatricule!, "DELETE", "Land", land.codeLand.toString());
        }

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
                {
                    model: Station,
                    as: "station",
                    attributes: ["codeStation", "name", "type"]
                }
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
            include: [
                { association: "user", attributes: { exclude: ["password"] } },
                {
                    model: Station,
                    as: "station",       // l’alias défini dans Land.belongsTo(Station)
                    attributes: ["codeStation", "name", "type", "startPk", "endPk"]
                }
            ],
        });

        return res.status(200).json(lands);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}


export const getStationForLand = async (req: Request, res: Response) => {
    try {
        const { startPk, endPk } = req.query;

        const station = await Station.findOne({
            where: {
                startPk: { [Op.lte]: Number(startPk) },
                endPk: { [Op.gte]: Number(endPk) },
            },
        });

        if (!station) return res.status(404).json({ message: "Aucune station trouvée" });

        res.json(station);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
