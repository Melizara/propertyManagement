import type { Request, Response } from "express";
import { Price } from "../models/price.model.ts";

export const createPrice = async (req: Request, res: Response) => {
    try {
        // Exemple des données statiques
        const pricesData = [
            // ==== Grande FIA ====
            // Agricole
            { secteur: "Grande FIA", usage: "Agricole", sousUsage: "", prix: 100 },

            // Commerciale
            { secteur: "Grande FIA", usage: "Commerciale", sousUsage: "terrain nu", prix: 400 },
            { secteur: "Grande FIA", usage: "Commerciale", sousUsage: "construction bois", prix: 1000 },
            { secteur: "Grande FIA", usage: "Commerciale", sousUsage: "construction dure", prix: 2000 },

            // Culturel
            { secteur: "Grande FIA", usage: "Culturel", sousUsage: "terrain nu", prix: 300 },
            { secteur: "Grande FIA", usage: "Culturel", sousUsage: "construction bois", prix: 800 },
            { secteur: "Grande FIA", usage: "Culturel", sousUsage: "construction dure", prix: 1850 },

            // Habitation
            { secteur: "Grande FIA", usage: "Habitation", sousUsage: "terrain nu", prix: 200 },
            { secteur: "Grande FIA", usage: "Habitation", sousUsage: "construction bois", prix: 600 },
            { secteur: "Grande FIA", usage: "Habitation", sousUsage: "construction dure", prix: 1600 },

            // ==== Grand MKR ====
            // Agricole
            { secteur: "Grand MKR", usage: "Agricole", sousUsage: "", prix: 100 },

            // Commerciale
            { secteur: "Grand MKR", usage: "Commerciale", sousUsage: "terrain nu", prix: 300 },
            { secteur: "Grand MKR", usage: "Commerciale", sousUsage: "construction bois", prix: 600 },
            { secteur: "Grand MKR", usage: "Commerciale", sousUsage: "construction dure", prix: 1400 },

            // Culturel
            { secteur: "Grand MKR", usage: "Culturel", sousUsage: "terrain nu", prix: 200 },
            { secteur: "Grand MKR", usage: "Culturel", sousUsage: "construction bois", prix: 500 },
            { secteur: "Grand MKR", usage: "Culturel", sousUsage: "construction dure", prix: 1250 },

            // Habitation
            { secteur: "Grand MKR", usage: "Habitation", sousUsage: "terrain nu", prix: 100 },
            { secteur: "Grand MKR", usage: "Habitation", sousUsage: "construction bois", prix: 350 },
            { secteur: "Grand MKR", usage: "Habitation", sousUsage: "construction dure", prix: 1000 },

            // ==== Moyenne ====
            // Agricole
            { secteur: "Moyenne", usage: "Agricole", sousUsage: "", prix: 50 },

            // Commerciale
            { secteur: "Moyenne", usage: "Commerciale", sousUsage: "terrain nu", prix: 100 },
            { secteur: "Moyenne", usage: "Commerciale", sousUsage: "construction bois", prix: 250 },
            { secteur: "Moyenne", usage: "Commerciale", sousUsage: "construction dure", prix: 500 },

            // Culturel
            { secteur: "Moyenne", usage: "Culturel", sousUsage: "terrain nu", prix: 70 },
            { secteur: "Moyenne", usage: "Culturel", sousUsage: "construction bois", prix: 170 },
            { secteur: "Moyenne", usage: "Culturel", sousUsage: "construction dure", prix: 400 },

            // Habitation
            { secteur: "Moyenne", usage: "Habitation", sousUsage: "terrain nu", prix: 35 },
            { secteur: "Moyenne", usage: "Habitation", sousUsage: "construction bois", prix: 110 },
            { secteur: "Moyenne", usage: "Habitation", sousUsage: "construction dure", prix: 330 },

            // ==== Petite ====
            // Agricole
            { secteur: "Petite", usage: "Agricole", sousUsage: "", prix: 25 },

            // Commerciale
            { secteur: "Petite", usage: "Commerciale", sousUsage: "terrain nu", prix: 50 },
            { secteur: "Petite", usage: "Commerciale", sousUsage: "construction bois", prix: 125 },
            { secteur: "Petite", usage: "Commerciale", sousUsage: "construction dure", prix: 250 },

            // Culturel
            { secteur: "Petite", usage: "Culturel", sousUsage: "terrain nu", prix: 35 },
            { secteur: "Petite", usage: "Culturel", sousUsage: "construction bois", prix: 85 },
            { secteur: "Petite", usage: "Culturel", sousUsage: "construction dure", prix: 200 },

            // Habitation
            { secteur: "Petite", usage: "Habitation", sousUsage: "terrain nu", prix: 20 },
            { secteur: "Petite", usage: "Habitation", sousUsage: "construction bois", prix: 55 },
            { secteur: "Petite", usage: "Habitation", sousUsage: "construction dure", prix: 165 },
        ];


        for (const priceData of pricesData) {
            await Price.findOrCreate({
                where: {
                    secteur: priceData.secteur,
                    usage: priceData.usage,
                    sousUsage: priceData.sousUsage
                },
                defaults: {
                    ...priceData,
                    prix: priceData.prix, // correspond à la colonne 'prix' dans ton modèle
                    userMatricule: req.userMatricule! // nécessaire selon le type
                }
            });
        }


        return res.status(201).json({ message: "Prix statiques ajoutés avec succès !" });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getPrices = async (req: Request, res: Response) => {
    try {
        const prices = await Price.findAll({
            order: [["codePrice", "ASC"]],
            include: [{ association: "user", attributes: { exclude: ["password"] } }],
        })

        return res.status(200).json(prices);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
