import type { Request, Response } from "express";
import { Tenant } from "../models/tenant.model.ts";
import { User } from "../models/user.model.ts";
import { logActivity } from "../middlewares/activityLogs.ts";

export const createTenant = async (req: Request, res: Response) => {
    try {
        if (!req.userMatricule) {
            return res.status(401).json({ error: "Utilisateur non authentifié" })
        };

        const { birthDate, dateCin, cin } = req.body;

        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        };

        if (age < 18) {
            return res.status(400).json({ error: "le locataire doit etre majeur" })
        }

        const cinDate = new Date(dateCin);
        const minCinDate = new Date(birth);
        minCinDate.setFullYear(minCinDate.getFullYear() + 18);

        if (cinDate < minCinDate) {
            return res.status(400).json({ error: "La date du CIN doit être à 18 ans ou plus" })
        }

        const cinRegex = /^\d{12}$/;

        if (!cinRegex.test(cin)) {
            return res.status(400).json({ error: "Le CIN doit être une suite de 12 chiffres" })
        }

        const tenant = await Tenant.create({
            name: req.body.name,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            birthPlace: req.body.birthPlace,
            cin: req.body.cin,
            cinPlace: req.body.cinPlace,
            dateCin: req.body.dateCin,
            father: req.body.father,
            mother: req.body.mother,
            address: req.body.address,
            neighborHood: req.body.neighborHood,
            municipality: req.body.municipality,
            userMatricule: req.body.userMatricule!,
        });

        if (tenant.cin !== undefined) {
            await logActivity(req.userMatricule!, "CREATE", "Tenant", tenant.cin.toString());
        }

        return res.status(201).json(tenant);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const updateTenant = async (req: Request, res: Response) => {
    try {
        const tenant = await Tenant.findByPk(req.params.cin);

        if (!tenant) {
            return res.status(404).json({ message: "not found tenant to update" });
        }

        const { birthDate, dateCin, cin } = req.body;

        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        };

        if (age < 18) {
            return res.status(400).json({ error: "le locataire doit etre majeur" })
        }

        const cinDate = new Date(dateCin);
        const minCinDate = new Date(birth);
        minCinDate.setFullYear(minCinDate.getFullYear() + 18);

        if (cinDate < minCinDate) {
            return res.status(400).json({ error: "La date du CIN doit être à 18 ans ou plus" })
        }

        const cinRegex = /^\d{12}$/;

        if (!cinRegex.test(cin)) {
            return res.status(400).json({ error: "Le CIN doit être une suite de 12 chiffres" })
        }

        await tenant.update({
            name: req.body.name,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            birthPlace: req.body.birthPlace,
            cin: req.body.cin,
            cinPlace: req.body.cinPlace,
            dateCin: req.body.dateCin,
            father: req.body.father,
            mother: req.body.mother,
            address: req.body.address,
            neighborHood: req.body.neighborHood,
            municipality: req.body.municipality,
            userMatricule: req.body.userMatricule!,
        });

        if (tenant.cin !== undefined) {
            await logActivity(req.userMatricule!, "UPDATE", "Tenant", tenant.cin.toString());
        }

        return res.status(200).json(tenant);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export const getTenant = async (req: Request, res: Response) => {
    try {
        const tenantId = req.params.cin;

        const tenant = await Tenant.findByPk(tenantId, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["matricule", "pseudo", "email"]
                },
            ]
        });

        if (!tenant) {
            return res.status(404).json({ message: "tenant not found" });
        }

        await tenant.save();

        return res.status(200).json(tenant);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getTenants = async (req: Request, res: Response) => {
    try {
        const tenants = await Tenant.findAll({
            order: [["cin", "DESC"]],
            include: [{ association: "user", attributes: { exclude: ["password"] } }]
        });

        return res.status(200).json(tenants);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const deleteTenant = async (req: Request, res: Response) => {
    try {
        const tenant = await Tenant.findByPk(req.params.cin);
        if (!tenant) {
            return res.status(404).json({ message: "not found tenant to update" });
        };

        await tenant.destroy();
        if (tenant.cin !== undefined) {
            await logActivity(req.userMatricule!, "DELETE", "Tenant", tenant.cin.toString());
        }
        return res.status(200).json(tenant);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}