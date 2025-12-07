import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/protectAuth.ts";
import { Location } from "../models/location.model.ts";
import { User } from "../models/user.model.ts";
import { Tenant } from "../models/tenant.model.ts";
import { Land } from "../models/land.model.ts";
import { Station } from "../models/station.model.ts";
import { logActivity } from "../middlewares/activityLogs.ts";
import { Price } from "../models/price.model.ts";
import PDFDocument from "pdfkit";
import type * as PDFKit from "pdfkit";
import fs from "fs";


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
        // Traduction droite/gauche → ankavan-dalana / ankavia
        const directionText =
            land.railwaySide?.toLowerCase() === "droite"
                ? "ankavan-dalana"
                : land.railwaySide?.toLowerCase() === "gauche"
                    ? "ankavian-dalana"
                    : land.railwaySide;

        // Traduction position : 1 = morona voalohany, 2 = morona faharoa
        // Convertir position (string → number)
        const pos = Number(land.position);

        // Traduction position : 1 = morona voalohany, 2 = morona faharoa
        const positionText =
            pos === 1
                ? "morona voalohany"
                : pos === 2
                    ? "morona faharoa"
                    : land.position;


        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=fanomezan-dalana_${location.codeLocation}.pdf`
        );

        doc.pipe(res);

        // --- TITRE ---
        // --- TITRE + LOGO ---
        const logoPath = "api/assets/image.png"; // chemin vers ton logo
        const titleText = `FANOMEZAN-DALANA N°: ${station.codeStation}/${location.codeLocation}/${new Date().getFullYear()}`;
        const pageWidth = doc.page.width;
        const margin = doc.page.margins.left; // 50 si tu laisses le margin à 50

        // Définir largeur et hauteur du logo
        const logoWidth = 80;
        const logoHeight = 50;

        // Vérifier si le logo existe pour éviter crash

        let logoExists = fs.existsSync(logoPath);

        // Y de départ
        let yStart = doc.y;


        // Dessiner logo à gauche
        if (logoExists) {
            doc.image(logoPath, margin, yStart, { width: logoWidth, height: logoHeight });
        }

        let textX = margin;
        let textWidth = pageWidth - 2 * margin;

        doc.fontSize(12).font('Helvetica').text("FITALEAVAN’NY LALAMBIM-\n PIRENENA F.C.E.", textX, yStart + logoHeight + 5, { width: textWidth, align: "left" });
        doc.moveDown(0.5);
        doc.fontSize(14).font("Helvetica-Bold");
        doc.text(titleText, textX, yStart + (logoExists ? logoHeight / 4 : 0), { width: textWidth, align: "right" });
        doc.moveDown(2);
        doc.fontSize(12).font('Helvetica').text(`Hanofa ny tanin’ny Lalamby ao ${station.name}`, { align: "right" });
        doc.moveDown(2);

        // --- INFORMATIONS LOCATAIRE ---
        doc.fontSize(12).font('Helvetica').text(`Ny TALEN’NY LALAMBIM-PIRENENA MALAGASY FCE dia manome alalana:`);
        doc.moveDown(0.5);
        doc.text(
            `An’A/toa ${tenant.name} ${tenant.lastName} hoe Mpanofa\n` +
            `Teraka tamin’ny ${tenant.birthDate} tao ${tenant.birthPlace}\n` +
            `Zanak'i ${tenant.father} sy i ${tenant.mother}\n` +
            `Karam-panondrom-pirenena laharana faha°: ${tenant.cin} natao tao ${tenant.cinPlace} tamin'ny ${tenant.dateCin}`
        );
        doc.text(`Monina ao: ${tenant.address}`);
        doc.text(`Fokontany: ${tenant.neighborHood}`);
        doc.text(`Kaominina: ${tenant.municipality}`);
        doc.moveDown(1);

        // --- INFORMATIONS TERRAIN ---
        doc.text(
            `Hampiasa ny sombin-tany mirefy ${land.area} m², ` +
            `ka Longueur ${land.length} metatra ny lavany, ary largeur ${land.width} metatra ny sakany.\n` +
            `Ao amin’ny tanin’ny Lalambim-pirenena FCE: PK ${land.startPk} ka hatreo PK ${land.endPk}, ` +
            `${directionText} raha ho any Manakara,${positionText} .\n` +
            `Fokontany: ${land.neighborHood}, Kaominina: ${land.municipality}.`
        );
        doc.moveDown(1);

        // --- ANDININY VOALOHANY ---
        doc.font('Helvetica-Bold').text("Andininy voalohany: Ny hampiasana ny tany", { underline: true });
        doc.font('Helvetica');

        let texteTany = "";

        texteTany += `Ny Lalamby FCE dia manome alalana ny mpanofa hampiasa ny sombin-tany voalaza etsy ambony:\n`

        // Tany sans usage précis (terrain nu)
        if (location.areaLandBare && location.areaLandBare > 0) {
            texteTany += `  - Tany tsy misy fanorenana mirefy: ${location.areaLandBare} m²\n`;
        } else {
            texteTany += `  - Tany tsy misy fanorenana mirefy ${land.area} m²\n`;
        }

        // Tany avec constructions
        if (location.areaWood && location.areaWood > 0) {
            texteTany += `  - Tany misy fanorenana trano hazo fonenana mirefy: ${location.areaWood} m²\n`;
        }
        if (location.areaPermanent && location.areaPermanent > 0) {
            texteTany += `  - Tany misy fanorenana trano vato fonenana mirefy: ${location.areaPermanent} m²\n`;
        }

        // Si aucune surface n’existe
        if (!texteTany) texteTany = "  - Tsy misy tany azo aseho.\n";

        doc.text(texteTany);


        doc.moveDown(1);

        // --- ANDININY FAHAROA ---
        doc.font('Helvetica-Bold').text("Andininy faharoa: Faharetan’ny fanomezan-dalana", { underline: true });
        doc.font('Helvetica').text(
            `   - Azo havaozina raha toa ka mbola tsy misy ilàn’ny Lalambim-pirenena ny tany.
        - Folo (10) taona ny faharetan’ity fanomezan-dalana ity, azo havaozina saingy mampahafantatra telo volana mialoha ny lalamby, raha misy fikasana hanohy fanofana.
        - Azo foanana raha vao misy antony ilàn’ny Lalambim-pirenena ny tany na misy tsy fifanarahana eo amin’ny roa tonta araka ny Andininy fahafito eto ambany.
Raha misy kosa fanamarihana avy amin’ny andaniny na ny ankilany ka mitaky ny fanovana ny fanomezan-dàlana dia tsy maintsy atao 03 volana mialoha ny fampiharana hatao.`
        );
        doc.moveDown(1);

        // --- ANDININY FAHATelo ---
        doc.font('Helvetica-Bold').text(
            "Andininy fahatelo: Ny Hofan-tany sy ny fomba fandoavana azy",
            { underline: true }
        );

        // Déterminer les sous-usages et surfaces
        const sousUsages: { type: string; area: number }[] = [];

        if (location.usage.toLowerCase() === "agricole") {
            if (land.area > 0) sousUsages.push({ type: "Tany fambolena", area: land.area });
        } else {
            if (location.areaLandBare > 0) sousUsages.push({ type: "Terrain nu", area: location.areaLandBare });
            if (location.areaWood > 0) sousUsages.push({ type: "Construction bois", area: location.areaWood });
            if (location.areaPermanent > 0) sousUsages.push({ type: "Construction dure", area: location.areaPermanent });
        }

        // Déterminer le type de paiement
        const periodicite = location.usage.toLowerCase() === "agricole" ? "isan-taona" : "isan'enimbolana";

        // Construire le texte pour tous les prix sur une seule ligne
        let prixText = `  - Ho an’ny ${periodicite} dia: `;
        const prixParts: string[] = [];
        let totalPrix = 0;

        for (const su of sousUsages) {
            // Pour agricole, pas de sousUsage
            const whereClause = location.usage.toLowerCase() === "agricole"
                ? { secteur: station.type, usage: location.usage }
                : { secteur: station.type, usage: location.usage, sousUsage: su.type };

            const priceEntry = await Price.findOne({ where: whereClause });
            const prixUnitaire = priceEntry ? priceEntry.prix : 0;

            prixParts.push(`${su.type} : ${prixUnitaire} ariary`);

            totalPrix += su.area * prixUnitaire;
        }

        // Joindre tous les prix sur une seule ligne
        prixText += prixParts.join(" , ") + "\n";

        // Ajouter les infos sur le paiement et sanctions (texte statique)
        prixText += `  - Ny hofany dia manontolo ${totalPrix} ariary, aloa manontolo amin’ny Kaontin’ny FCE, BOA 0009 02000 1 294564 000 0 – 88, amin’ny voalohany ka hatramin’ny faha folo ny volana diavina, ary alefa amin’ny adiresy Mailaka: contact.fce@fce.mg sy livaniaina.razafindrabenja@fce.mg, ny «Bordereau de versement» ho fanamarinana ny vola naloa, na koa aterina ao amin’ny Gara FCE ${location.placePaymment} ao anatin’ny fotoana voafaritra ka tsy azo asiana fahatarana.
  - Ny fahataran’ny fandoavana hofa-tany dia ahazoana sazy ka miampy iray isan-jato 1% isan’andro amin’ny hofany tokony haloa araka ny isan’ny andron’ny fahatarana.
  - Ny tsy fandoavana ny hofan-tany enim-bolana 02 mifanarakaraka dia mitarika avy hatrany ny fanafoanana ny fanomezan-dalana hampiasa ny tany, ary henjehina araka ny lalàna misy ny mpanofa tany izay minia manao izany.
`;

        doc.font('Helvetica').text(prixText);

        doc.moveDown(1);

        // --- ANDININY 4 à 9 ---
        const andininy: { title: string, content: string }[] = [
            {
                title: "Andininy fahefatra: Fanovana mahakasika ny fanofana tany",
                content: `Raha misy fanovana momba ny hofan-tany na ny fomba fandoavana azy dia amin’ny alalan’ny naotin’ny orinasa no anaovana izany ary ampiharina (03) telo volana aorian’ny daty namoahana azy.
Raha tsy hampiasain’ny mpanofa intsony ny tany dia averina manontolo amin’ny Lalambim-pirenena fa tsy azo afindra amin’olon-kafa.`
            },
            {
                title: "Andininy fahadimy: Fahazoan-dalana amin’ny fanorenana",
                content: `Ny vinavinam-panorenana rehetra izay kasain’ny mpanofa hatao dia tsy maintsy angatahana fahazahoan-dalana avy amin’ny talen’ny lalambim-pirenena FCE izany. Ny fandikana izany dia mitarika avy hatrany ny fanafoanana ny fanomezan-dalana.`
            },
            {
                title: "Andininy fahaenina: Fanafoanana ny fanomezan-dalana",
                content: `Ny Lalambim-pirenena Malagasy dia manana fahefana hanafoana ity fanomezan-dalana ity rehefa avy nanome fampandresenesana an-tsoratra telo (3) volana mialoha.
Mihatra avy hatrany io fanafoanana io, telo (3) volana aorian’ny daty naharaisana ny taratasy fampandrenesana.
Fa ireto antony manaraka ireto kosa dia manafoana avy hatrany ity fanomezan-dalana ity tsy misy fampandrenesana mialoha:
        1.Ny fanorenana tsy nahazoana ny fankatoavana mialoha avy amin’ny TALEN’NY LALAMBY FCE;
        2. Ny fampanofana manontolo na amin’ny ampahany ny tany voarakitra ato anatin’ity fanomezan-dalana ity amin’olon-kafa;
        3. Ny tsy fandoavana ara-dalàna ny hofan-tany, izay ampahafantarina ny mpanofa amin’ny alalan’ny taratasy fitakiana hofa-tany farany;
        4. Ny tsy fanatanterahana ny asa fandoavana sandan’ny fahazoan-dàlana ao anatin’ny fe-potoana ara-dàlana, izay ampahafantarina ny mpanofa amin’ny alalan’ny taratasy fampitandremana farany;
        5. Ny famarotana manontolo na amin’ny ampahany ny tany voarakitra ato anatin’ity fanomezan-dalana ity amin’olon-kafa.
Ireo fepetra ireo dia tsy manafoana ny fahafahan’ny Lalamby hanenjika araka ny lalàna misy ny mpanofa tany minia manao ireo fandikàna ireo.`
            },
            {
                title: "Andininy fahafito: Fanalana fanorenana sy onitra",
                content: `Manaiky ny mpanofa fa hanala ny fanorenana rehetra nataony mialohan’ny vaninandro ahataperan’ny fe-potoana voalaza amin’ny Andininy fahaenina, ka izy no miantoka ny fandaniana rehetra amin’izany, na hoatrinona no mety ho tombam-bidiny ary na toa inona karazam-pitaovana nampiasainy. Ary tsy manana zo ny mpanofa hitaky onitra amin’ny Lalamby FCE.`
            },
            {
                title: "Andininy fahavalo: Fiovana adiresy",
                content: `Ny taratasy fitakiam-bola dia alefa amin’ny adiresy voalaza etsy ambony ka adidin’ny mpanofa ny mampandre ny Lalamby raha sanatria misy fiovana ny toeram-ponenan’ny mpanofa. Izany no atao dia ny mba ahafahana mandefa ara-potoana ny taratasy fitakiam-bola sy hisorohana ny fandaniam-potoana mety hisy eo amin’ny fivezivezen’ny taratasy.`
            },
            {
                title: "Andininy fahasivy: Fepetra manokana",
                content: `Ny mpanofa no mandoa ny hetra rehetra mandritra ny fe-potoana ampiasany ny tany. Na eo anivon’ny kaominina na eo anivon’ny sampandraharaham-panjakana isan-tsokajiny.
Ny Lalambim-pirenena FCE irery ihany no manam-pahefana amin’ny fananany, koa ho enjehina araka ny lalàna manan-kery ireo izay minia mividy na mivarotra ny tanin’ny Lalamby, satria fisolokiana fananam-panjakana izany.`
            },
        ];

        andininy.forEach(a => {
            doc.moveDown(1);
            doc.font('Helvetica-Bold').text(a.title, { underline: true });
            doc.font('Helvetica').text(a.content);
        });

        // --- TEXTE FINAL (date et ville) ---
        doc.moveDown(1);
        doc.text(`Natao teto ${station.name}, ${new Date().toLocaleDateString()}`, { align: "right" });
        doc.moveDown(2); // espace avant les signatures

        // Définir les positions horizontales pour les colonnes
        const pageWidth2 = doc.page.width;
        const margin2 = doc.page.margins.left;
        const leftX = margin; // colonne gauche
        const centerX = pageWidth2 / 3; // centre
        const rightX = pageWidth2 - margin2 - 200; // colonne droite, 200 = largeur approx du texte

        let currentY = doc.y; // y de départ pour toutes les signatures

        // --- Colonne gauche : Locataire ---
        doc.fontSize(10).font("Helvetica-Bold").text("NY MPANOFA", leftX, currentY);
        doc.font("Helvetica").text("Voaray ny fampahafantarana,\nvoavaky ary ekena,\nanio", leftX, doc.y);

        // --- Colonne centre : Directeur ---
        const centerY = currentY;
        doc.font("Helvetica-Bold").text("NY TALE LEFITRY NY FCE", centerX, centerY, { width: 200, align: "center" });
        doc.moveDown(8);
        doc.font("Helvetica").text("RAJAOBELISON Rova", centerX, doc.y, { width: 200, align: "center" });

        // --- Colonne droite : Responsable foncier ---
        const rightY = currentY;
        doc.font("Helvetica-Bold").text("NY TOMPON’ANDRAIKITRY\nNY FANANAN-TANY", rightX, rightY, { width: 200, align: "right" });
        doc.moveDown(7);
        doc.font("Helvetica").text("RAZAFINDRABENJA Livaniaina Lucie", rightX, doc.y, { width: 200, align: "right" });

        // --- FIN DU PDF ---
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

type Cell = string | number | null | undefined;
type PDFDoc = InstanceType<typeof PDFDocument>;
// --- Fonction pour le tableau principal ---
const drawRow = (
    doc: PDFDoc,
    y: number,
    col1: Cell,
    col2: Cell,
    col3: Cell,
    col4?: Cell
) => {
    const startX = 50;
    const rowHeight = 20;

    // Largeurs des colonnes
    const widths = [130, 120, 100, 100];

    // Dessiner le texte
    doc.text(col1 != null ? String(col1) : "", startX + 2, y + 2, { width: widths[0] - 4 });
    doc.text(col2 != null ? String(col2) : "", startX + widths[0] + 2, y + 2, { width: widths[1] - 4, align: "left" });
    doc.text(col3 != null ? String(col3) : "", startX + widths[0] + widths[1] + 2, y + 2, { width: widths[2] - 4, align: "left" });
    if (col4 !== undefined)
        doc.text(col4 != null ? String(col4) : "", startX + widths[0] + widths[1] + widths[2] + 2, y + 2, { width: widths[3] - 4, align: "left" });

    // Dessiner les bordures
    let x = startX;
    const allCols = col4 !== undefined ? 4 : 3;
    for (let i = 0; i < allCols; i++) {
        doc.rect(x, y, widths[i], rowHeight).stroke();
        x += widths[i];
    }
};

// --- Fonction pour les lignes d'info ---
const drawInfoRow = (
    doc: PDFDoc,
    y: number,
    compte: string,
    codeGare: string,
    nom: string
) => {
    const startX = 50;
    const colWidths = [250, 150, 120]; // Largeurs des colonnes
    const rowHeight = 20;

    // Texte
    doc.text(compte, startX + 2, y + 2, { width: colWidths[0] - 4 });
    doc.text(codeGare, startX + colWidths[0] + 2, y + 2, { width: colWidths[1] - 4, align: "left" });
    doc.text(nom, startX + colWidths[0] + colWidths[1] + 2, y + 2, { width: colWidths[2] - 4, align: "left" });

    // Bordures
    let x = startX;
    for (let i = 0; i < colWidths.length; i++) {
        doc.rect(x, y, colWidths[i], rowHeight).stroke();
        x += colWidths[i];
    }
};

// --- Nouvelle fonction pour le header logo + phrase + infos ---
const drawHeaderRow = (
    doc: PDFDoc,
    y: number,
    logoPath: string,       // chemin vers ton logo
    phrase: string,         // phrase à afficher
    infos: string[]         // tableau de 4 lignes
) => {
    // Colonne 1 : Logo (aligné avec Compte à débiter)
    const logoWidth = 100;
    const logoHeight = 50;
    if (logoPath) {
        doc.image(logoPath, 50, y, { width: logoWidth, height: logoHeight });
    }

    // Colonne 2 : Phrase (alignée avec Superficie jusqu'à Montant)
    doc.text(phrase, 180, y, { width: 220 }); // largeur ajustable

    // Colonne 3 : 4 lignes (aligné avec Montant)
    infos.forEach((line, index) => {
        doc.text(line, 400, y + index * 12); // espacement de 12 pts entre les lignes
    });
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

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=facture_${location.codeLocation}.pdf`
        );
        doc.pipe(res);

        // Fonction pour dessiner une page de facture
        function drawInvoicePage(doc: PDFKit.PDFDocument, location: any, tenant: any, land: any, station: any) {
            const now = new Date();
            const currentYear = now.getFullYear();
            doc.fontSize(10)
            // --- HEADER ---
            let yHeader = doc.y;
            const exercice = ["agricole"].includes(location.usage) ? "annuelle" : "semestrielle";
            const periode = ["agricole"].includes(location.usage)
                ? `${currentYear - 1}-${currentYear}`
                : now.getMonth() + 1 <= 6
                    ? `1er semestre ${currentYear}`
                    : `2e semestre ${currentYear}`;

            const facture = `${location.codeLocation}/TER/2025`;

            drawHeaderRow(
                doc,
                yHeader,
                "api/assets/image.png",
                "RESEAU NATIONAL DES CHEMINS DE FER MALAGASY\nDIRECTION DE LA LIGNE FERROVIAIRE\nFIANARANTSOA COTE-EST",
                [
                    `DM : 04`,
                    `FACTURE : ${facture}`,
                    `EXERCICE : ${exercice}`,
                    `PERIODE : ${periode}`
                ]
            );

            doc.moveDown(1.5);

            // --- INFOS GENERALES ---
            let y = doc.y;
            drawInfoRow(doc, y, `Compte à débiter :  `, ` Code gare: ${station.codeStation}`, `Nom du locataire : ${tenant.name}`);
            drawInfoRow(doc, y + 20, "Compte à créditer : 0009 02000 1 294564 000 0 – 88", `Destination : ${location.placePaymment || ""}`, "");
            drawInfoRow(doc, y + 40, `Convention : ${station.codeStation}/${location.codeLocation}/${currentYear}`, `PK Com : ${land.startPk}`, "");
            drawInfoRow(doc, y + 60, `Perception : ${location.placePaymment || ""}`, `PK Fin : ${land.endPk}`, `Adresse : ${tenant.address}`);
            drawInfoRow(doc, y + 80, `Code tarif : `, `Superficie : ${land.area ?? 0}`, "");

            doc.moveDown(2);

            // --- TABLEAU PRINCIPAL ---
            // 1️⃣ Position du texte
            const textX = 50;
            const textY = doc.y;
            const textWidth = 525; // largeur du rectangle
            const textHeight = 20; // hauteur du rectangle

            // 2️⃣ Dessiner le rectangle autour du texte
            doc.rect(textX - 2, textY - 2, textWidth, textHeight).lineWidth(1).stroke();

            // 3️⃣ Écrire le texte à l’intérieur du rectangle
            doc.fontSize(11)
                .text("LOCATION TERRAIN", textX, textY, { continued: true })
                .text("MONTANT(Ar)", { align: "right" });


            doc.moveDown(0.6);
            doc.fontSize(11);
            drawRow(doc, doc.y, "TYPE DE LOCATION", "SUPERFICIE", "PU (Ar/m2)", "MONTANT");
            doc.moveDown(0.6);

            doc.fontSize(10);

            const items = [
                ["Usage habitation", location.usage === "Habitation" ? (Number(location.areaWood) + Number(location.areaPermanent)) : "", location.usage === "Habitation" ? (Number(location.priceWood) + Number(location.pricePermanent)) : ""],
                ["Usage commercial", location.usage === "Commerciale" ? (Number(location.areaWood) + Number(location.areaPermanent)) : "", location.usage === "Commerciale" ? (Number(location.priceWood) + Number(location.pricePermanent)) : ""],
                ["Usage agricole", location.usage === "Agricole" ? Number(land.area) : "", location.usage === "Agricole" ? location.priceLandBare : ""],
                ["Usage culturel", location.usage === "Culturel" ? (Number(location.areaWood) + Number(location.areaPermanent)) : "", location.usage === "Culturel" ? (Number(location.priceWood) + Number(location.pricePermanent)) : ""],
                ["Terrain nu A.D", location.usage === "Commerciale" || location.usage === "Habitation" || location.usage === "Culturel" ? Number(location.areaLandBare) : "", location.usage === "Commerciale" || location.usage === "Habitation" || location.usage === "Culturel" ? location.priceLandBare : ""]
            ];



            let currentY = doc.y;
            let currentX = doc.x;
            let totalHorsTVA = 0;

            items.forEach(([label, area, pu]) => {
                const superficie = Number(area) || 0;
                const montant = Number(pu) || 0;
                const puUnit = superficie !== 0 ? montant / superficie : 0;
                totalHorsTVA += montant;
                drawRow(doc, currentY, label, superficie, puUnit, montant);
                currentY += 20;
            });

            // --- Totaux ---
            const tva = totalHorsTVA * 0.2;
            const totalTTC = totalHorsTVA + tva;
            doc.moveDown(0.6);
            currentY += 10;
            drawRow(doc, currentY, "TOTAL hors TVA", "", "", totalHorsTVA);
            currentY += 20;
            drawRow(doc, currentY, "TVA 20%", "", "", tva);
            currentY += 20;
            drawRow(doc, currentY, "TOTAL TTC", "", "", totalTTC);
            currentY += 20;

            // 1️⃣ Position du texte
            const totalX = currentX - 500;
            const totalY = currentY - 100;

            // 3️⃣ Écrire le texte à l’intérieur du rectangle
            doc.fontSize(15).font("Helvetica-Bold");
            doc.text(totalTTC.toString(), totalX, totalY, { align: "right" });

            doc.moveDown(5);

            // --- TEXTE EXPLICATIF ---
            const startY = doc.y;
            doc.fontSize(10).font("Helvetica");
            doc.text(
                "A régulariser dans deux (02) mois après la réception de la présente facture. Arrêtée la présente facture de la somme d’Ariary",
                doc.page.margins.left,
                startY,
                { width: doc.page.width - 2 * doc.page.margins.left, align: "left" }
            );
            doc.moveDown(2);

            // --- SIGNATURES ---
            const pageWidth = doc.page.width;
            const margin = doc.page.margins.left;
            const leftX = margin;
            const rightX = pageWidth - margin - 250;
            const sigY = doc.y;

            doc.font("Helvetica-Bold").text("Le Directeur Adjoint de la FCE", leftX, sigY);
            doc.moveDown(5);
            doc.font("Helvetica").text("RAJAOBELISON Rova", leftX, doc.y);

            const datenow = new Date();
            const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
            const dateText = `${land.placePaymment || "Fianarantsoa"}, le ${datenow.toLocaleDateString("fr-FR", options)}`;

            doc.font("Helvetica").fontSize(10).text(dateText, rightX, sigY - 20, { width: 250, align: "right" });
            doc.font("Helvetica-Bold").text(
                "Le Chef Service Patrimoine et Développement Commercial",
                rightX,
                sigY,
                { width: 250, align: "right" }
            );

            doc.moveDown(4);
            doc.font("Helvetica").text(
                "RAZAFINDRABENJA Livaniaina Lucie",
                rightX,
                doc.y,
                { width: 250, align: "right" }
            );

            doc.moveDown(3);

            doc.font("Helvetica").fontSize(9).text(
                "1, Avenue du Général Leclerc Ampasambazaha Fianarantsoa 301 – BP 1003\n" +
                "RIB BOA 0009 02000 1 294564 000 0 – 88\n" +
                "TeL : 020 85 001 27 – 038 92 932 14 – 034 55 499 17 _ Email : contact.fce@fce.mg",
                doc.page.margins.left,
                doc.page.height - 100,
                { width: doc.page.width - 2 * doc.page.margins.left, align: "center" }
            );
        }

        // --- PAGE PRINCIPALE ---
        drawInvoicePage(doc, location, tenant, land, station);

        // --- COPIE ---
        doc.addPage();
        drawInvoicePage(doc, location, tenant, land, station);

        doc.end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};