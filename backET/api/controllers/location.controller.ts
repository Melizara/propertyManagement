import type { Request, Response } from "express";
import { Location } from "../models/location.model.ts";
import { User } from "../models/user.model.ts";
import { Tenant } from "../models/tenant.model.ts";
import { Land } from "../models/land.model.ts";

export const createLocation = async (req: Request, res: Response) => {
    try {
        if (!req.userMatricule) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }
        const location = await Location.create({
            cin: req.body.cin,
            codeLand: req.body.codeLand,
            usage: req.body.usage,
            areaLandBare: req.body.areaLandBare,
            areaWood: req.body.areaWood,
            areaPermanent: req.body.areaPermanent,
            priceLandBare: req.body.priceLandBare,
            priceWood: req.body.priceWood,
            pricePermanent: req.body.pricePermanent,
            typePayment: req.body.typePayment,
            methodPayment: req.body.methodPayment,
            placePaymment: req.body.placePaymment,
            userMatricule: req.userMatricule!
        });
        return res.status(201).json(location);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const location = await Location.findByPk(req.params.codeLocation);

        if (!location) {
            return res.status(404).json({ message: "Location not found for update" });
        }

        await location.update({
            cin: req.body.cin,
            codeLand: req.body.codeLand,
            usage: req.body.usage,
            areaLandBare: req.body.areaLandBare,
            areaWood: req.body.areaWood,
            areaPermanent: req.body.areaPermanent,
            priceLandBare: req.body.priceLandBare,
            priceWood: req.body.priceWood,
            pricePermanent: req.body.pricePermanent,
            typePayment: req.body.typePayment,
            methodPayment: req.body.methodPayment,
            placePaymment: req.body.placePaymment,
            userMatricule: req.userMatricule!
        });

        return res.status(200).json(location);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getLocation = async (req: Request, res: Response) => {
    try {
        const location = await Location.findByPk(req.params.codeLocation, {
            include: [
                { model: User, as: "user", attributes: ["matricule", "pseudo", "email"] },
                { model: Tenant, as: "tenant", attributes: ["cin", "name"] },
                { model: Land, as: "land", attributes: ["codeLand", "area"] }
            ],
        });

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        return res.status(200).json(location);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getLocations = async (req: Request, res: Response) => {
    try {
        const locations = await Location.findAll({
            order: [["codeLocation", "DESC"]],
            include: [
                { model: User, as: "user", attributes: { exclude: ["password"] } },
                { model: Tenant, as: "tenant", attributes: ["cin", "name"] },
                { model: Land, as: "land", attributes: ["codeLand","area"] }
            ],
        });

        return res.status(200).json(locations);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const location = await Location.findByPk(req.params.codeLocation);

        if (!location) {
            return res.status(404).json({ message: "Location not found for delete" });
        }

        await location.destroy();
        return res.status(200).json(location);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
