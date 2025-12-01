import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/protectAuth.ts";
import { Location } from "../models/location.model.ts";
import { User } from "../models/user.model.ts";
import PDFDocument from "pdfkit";
import { Tenant } from "../models/tenant.model.ts";
import { Land } from "../models/land.model.ts";
import { Station } from "../models/station.model.ts";
import { logActivity } from "../middlewares/activityLogs.ts";

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
            statusPayment: false,
            userMatricule: req.userMatricule!
        });

        await Land.update(
            { available: false },
            { where: { codeLand: req.body.codeLand } } // ✅ utilise la valeur directement
        );

        if (location.codeLocation !== undefined) {
            await logActivity(req.userMatricule!, "CREATE", "Location", location.codeLocation.toString());
        }

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
            statusPayment: false,
            userMatricule: req.userMatricule!
        });

        await Land.update(
            { available: false },
            { where: { codeLand: req.body.codeLand } } // ✅ utilise la valeur directement
        );

        if (location.codeLocation !== undefined) {
            await logActivity(req.userMatricule!, "UPDATE", "Location", location.codeLocation.toString());
        }

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
                { model: Land, as: "land", attributes: ["codeLand", "area"] }
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

        try {
            const result = await Land.update(
                { available: true },
                { where: { codeLand: location.codeLand } }
            );
            console.log(result);
        } catch (error) {
            console.error(error)
        }

        if (location.codeLocation !== undefined) {
            await logActivity(req.userMatricule!, "DELETE", "Location", location.codeLocation.toString());
        }

        return res.status(200).json(location);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
    try {
        if (req.userPoste !== "caissier") {
            return res.status(403).json({ error: "Accès refusé : seuls les caissiers peuvent confirmer le paiement" });
        }

        const location = await Location.findByPk(req.params.codeLocation);
        if (!location) return res.status(404).json({ error: "Location non trouvée" });

        location.statusPayment = true;
        await location.save();

        if (req.userMatricule && location.codeLocation !== undefined) {
            await logActivity(
                req.userMatricule,
                "CONFIRM_PAYMENT",
                "Location",
                location.codeLocation.toString()
            );
        }

        return res.status(200).json({ message: "Paiement confirmé", location });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};

export const generateConventionPdf = async (req: AuthRequest, res: Response) => {
    try {
        const location = await Location.findByPk(req.params.codeLocation, {
            include: [
                { model: Tenant, as: "tenant" },
                { model: Land, as: "land", include: [{ model: Station, as: "station" }] },
            ],
        });

        if (!location) return res.status(404).json({ error: "Location non trouvée" });

        const tenant = location.tenant!;
        const land = location.land!;
        const station = land.station!;

        // Créer un nouveau PDF
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=convention_${location.codeLocation}.pdf`);

        doc.pipe(res);

        doc.fontSize(18).text("Convention de Location", { align: "center" });
        doc.moveDown();

        const currentYear = new Date().getFullYear();
        doc.fontSize(12).text(`Code Location : ${location.codeLocation}`);
        doc.text(`Année de génération : ${currentYear}`);
        doc.moveDown();

        // Infos gare
        doc.fontSize(12).text(`Code Gare : ${station.codeStation}`);
        doc.text(`Nom Gare : ${station.name}`);
        doc.moveDown();

        // Infos locataire
        doc.text(`Nom : ${tenant.name}`);
        doc.text(`Prénom : ${tenant.lastName}`);
        doc.text(`Date de naissance : ${tenant.birthDate}`);
        doc.text(`Lieu de naissance : ${tenant.birthPlace}`);
        doc.text(`Père : ${tenant.father}`);
        doc.text(`Mère : ${tenant.mother}`);
        doc.text(`CIN : ${tenant.cin}`);
        doc.text(`Date CIN : ${tenant.dateCin}`);
        doc.text(`Lieu CIN : ${tenant.cinPlace}`);
        doc.text(`Adresse : ${tenant.address}`);
        doc.text(`Quartier : ${tenant.neighborHood}`);
        doc.text(`Commune : ${tenant.municipality}`);
        doc.moveDown();

        // Infos terrain
        const totalSurface = land.area;
        doc.text(`Surface totale du terrain : ${totalSurface}`);
        doc.text(`PK début : ${land.startPk}`);
        doc.text(`PK fin : ${land.endPk}`);
        doc.text(`Railway Side : ${land.railwaySide}`);
        doc.text(`Position : ${land.position}`);
        doc.text(`Quartier : ${land.neighborHood}`);
        doc.text(`Commune : ${land.municipality}`);
        doc.moveDown();

        // Surface et prix
        doc.text(`Surface terrain nu : ${location.areaLandBare} m²`);
        doc.text(`Surface terrain construction dure : ${location.areaPermanent} m²`);
        doc.text(`Surface terrain construction bois : ${location.areaWood} m²`);
        doc.text(`Prix terrain nu : ${location.priceLandBare}`);
        doc.text(`Prix terrain construction dure : ${location.pricePermanent}`);
        doc.text(`Prix terrain construction bois : ${location.priceWood}`);
        const totalPrice = location.priceLandBare + location.pricePermanent + location.priceWood;
        doc.text(`Prix total du terrain : ${totalPrice}`);
        doc.moveDown();

        // Lieu de paiement
        doc.text(`Lieu de paiement : ${location.placePaymment}`);

        doc.end();

        if (req.userMatricule && location.codeLocation !== undefined) {
            await logActivity(
                req.userMatricule,
                "CONVENTION",
                "Location",
                location.codeLocation.toString()
            );
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur lors de la génération du PDF" });
    }
};

export const generateInvoicePdf = async (req: AuthRequest, res: Response) => {
    try {
        const location = await Location.findByPk(req.params.codeLocation, {
            include: [
                { model: Tenant, as: "tenant" },
                { model: Land, as: "land", include: [{ model: Station, as: "station" }] },
            ],
        });

        if (!location) return res.status(404).json({ error: "Location non trouvée" });

        const tenant = location.tenant!;
        const land = location.land!;
        const station = land.station!;

        // Créer un nouveau PDF
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=facture_${location.codeLocation}.pdf`
        );

        doc.pipe(res);

        const currentYear = new Date().getFullYear();

        // Titre
        doc.fontSize(18).text("Facture de Location", { align: "center" });
        doc.moveDown();

        // Infos générales
        doc.fontSize(12);
        doc.text(`Type de paiement : ${location.typePayment}`);
        doc.text(`Code Location : ${location.codeLocation}`);
        doc.text(`Année : ${currentYear}`);
        doc.moveDown();

        // Infos locataire
        doc.text(`Nom : ${tenant.name}`);
        doc.text(`Prénom : ${tenant.lastName}`);
        doc.text(`Adresse : ${tenant.address}`);
        doc.text(`Lieu de paiement : ${location.placePaymment}`);
        doc.moveDown();

        // Infos terrain
        doc.text(`Code Gare : ${station.codeStation}`);
        doc.text(`PK début : ${land.startPk}`);
        doc.text(`PK fin : ${land.endPk}`);
        doc.moveDown();

        // Tableau des surfaces et prix
        doc.text("Détails du terrain :", { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const itemSpacing = 150;

        // Entêtes
        doc.text("Type", 50, tableTop);
        doc.text("Surface (m²)", 200, tableTop);
        doc.text("Prix (USD)", 350, tableTop);

        const row1Y = tableTop + 20;
        doc.text("Terrain nu", 50, row1Y);
        doc.text(location.areaLandBare.toString(), 200, row1Y);
        doc.text(location.priceLandBare.toString(), 350, row1Y);

        const row2Y = row1Y + 20;
        doc.text("Construction dure", 50, row2Y);
        doc.text(location.areaPermanent.toString(), 200, row2Y);
        doc.text(location.pricePermanent.toString(), 350, row2Y);

        const row3Y = row2Y + 20;
        doc.text("Construction bois", 50, row3Y);
        doc.text(location.areaWood.toString(), 200, row3Y);
        doc.text(location.priceWood.toString(), 350, row3Y);

        // Total
        const totalPrice = location.priceLandBare + location.pricePermanent + location.priceWood;
        doc.moveDown(5);
        doc.fontSize(14).text(`Prix total : ${totalPrice} USD`, { align: "right" });

        doc.end();

        if (req.userMatricule && location.codeLocation !== undefined) {
            await logActivity(
                req.userMatricule,
                "FACTURE",
                "Location",
                location.codeLocation.toString()
            );
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur lors de la génération de la facture" });
    }
};

