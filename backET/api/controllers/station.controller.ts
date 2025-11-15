import type { Request, Response } from "express";
import { Station } from "../models/station.model.ts";
import { User } from "../models/user.model.ts";

export const createStation = async (req: Request, res: Response) => {
    try {
        if (!req.userMatricule) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        // Liste des gares à insérer
        const stationsData = [
            // Grandes Gares
            { codeStation: 480, name: "Fianarantsoa", type: "Grande", startPk: 0, endPk: 9 },
            { codeStation: 497, name: "Manakara", type: "Grande", startPk: 163, endPk: 163 },

            // Moyennes Gares
            { codeStation: 481, name: "Vohimarina", type: "Moyenne", startPk: 9, endPk: 21 },
            { codeStation: 482, name: "Sahambavy", type: "Moyenne", startPk: 21, endPk: 28 },
            { codeStation: 487, name: "Tologoina", type: "Moyenne", startPk: 62, endPk: 72 },
            { codeStation: 489, name: "Manampatrana", type: "Moyenne", startPk: 79, endPk: 88 },
            { codeStation: 491, name: "Mahabako", type: "Moyenne", startPk: 99, endPk: 107 },
            { codeStation: 492, name: "Fenomby", type: "Moyenne", startPk: 107, endPk: 116 },
            { codeStation: 493, name: "Sahasihanaka", type: "Moyenne", startPk: 116, endPk: 128 },

            // Petites Gares
            { codeStation: 483, name: "Ampitambe", type: "Petite", startPk: 28, endPk: 38 },
            { codeStation: 484, name: "Ranomena", type: "Petite", startPk: 38, endPk: 45 },
            { codeStation: 485, name: "Andrambovato", type: "Petite", startPk: 45, endPk: 54 },
            { codeStation: 486, name: "Madiorano", type: "Petite", startPk: 54, endPk: 62 },
            { codeStation: 488, name: "Amboanjobe", type: "Petite", startPk: 72, endPk: 79 },
            { codeStation: 490, name: "Ionilahy", type: "Petite", startPk: 88, endPk: 99 },
            { codeStation: 494, name: "Antsaka", type: "Petite", startPk: 128, endPk: 137 },
            { codeStation: 495, name: "Mizilo", type: "Petite", startPk: 137, endPk: 146 },
            { codeStation: 496, name: "Ambila", type: "Petite", startPk: 146, endPk: 163 },
        ];

        // Boucle pour créer toutes les stations
        for (const stationData of stationsData) {
            await Station.findOrCreate({
                where: { codeStation: stationData.codeStation },
                defaults: { ...stationData, userMatricule: req.userMatricule! }
            });
        }

        return res.status(201).json({ message: "Toutes les gares ont été ajoutées avec succès !" });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};


export const updateStation = async (req: Request, res: Response) => {
    try {
        const station = await Station.findByPk(req.body.codeStation);

        if (!station) {
            return res.status(404).json({ message: "not found station to update" });
        }

        await station.update({
            codeStation: req.body.codeStation,
            name: req.body.name,
            type: req.body.type,
            startPk: req.body.startPk,
            endPk: req.body.endPk,
            userMatricule: req.userMatricule!
        });

        return res.status(200).json(station);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getStation = async (req: Request, res: Response) => {
    try {
        const codeStation = req.params.codeStation;

        const station = await Station.findByPk(codeStation, {
            include: [
                {
                    model: User,
                    as: "user", // si tu as défini l'alias dans les relations
                    attributes: ["matricule", "pseudo", "email"] // sélectionner seulement les champs voulus
                    // si tu veux inclure password aussi : ["id","username","email","password"]
                },
            ]
        })

        if (!station) {
            return res.status(404).json.apply({ message: "Station not found" });
        };

        await station.save();

        return res.status(200).json(station)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const getStations = async (req: Request, res: Response) => {
    try {
        const stations = await Station.findAll({
            order: [["codeStation", "ASC"]],
            include: [{ association: "user", attributes: { exclude: ["password"] } }],
        })

        return res.status(200).json(stations);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const deleteStation = async (req: Request, res: Response) => {
    try {
        const station = await Station.findByPk(req.params.codeStation);

        if (!station) {
            return res.status(404).json({ message: "not found station to delete" });
        }

        await station.destroy();
        return res.status(200).json(station);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}