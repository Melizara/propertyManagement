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

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=fanomezan-dalana_${location.codeLocation}.pdf`
        );

        doc.pipe(res);

        // --- TITRE ---
        doc.fontSize(18).font('Helvetica-Bold').text(
            `FANOMEZAN-DALANA N°: ${station.codeStation}/${location.codeLocation}/${new Date().getFullYear()}`,
            { align: "center" }
        );
        doc.moveDown(1);
        doc.fontSize(12).font('Helvetica').text(`Hanofa ny tanin’ny Lalamby ao ${station.name}`, { align: "center" });
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
            `${land.railwaySide} raha ho any Manakara, morona faharoa.\n` +
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

        doc.moveDown(1);
        doc.text(`Natao teto ${station.name}, ${new Date().toLocaleDateString()}`, { align: "right" });

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
    doc.text(col1 != null ? String(col1) : "", 50, y);
    doc.text(col2 != null ? String(col2) : "", 180, y);
    doc.text(col3 != null ? String(col3) : "", 300, y);
    if (col4 !== undefined) doc.text(col4 != null ? String(col4) : "", 400, y);
};
// --- Fonction pour les lignes d'info ---
const drawInfoRow = (
    doc: PDFDoc,
    y: number,
    compte: string,
    codeGare: string,
    nom: string
) => {
    // Compte à débiter → s'étire jusqu'à PU (x = 50 → 300)
    doc.text(compte, 50, y, { width: 300 });
    // Code Gare → sous PU
    doc.text(codeGare, 300, y);
    // Nom → sous MONTANT
    doc.text(nom, 470, y);
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
        // --- NOUVEAU TABLEAU HEADER ---
        doc.fontSize(10);

        let yHeader = doc.y;
        // Déterminer exercice et période
        let exercice: string;
        let periode: string;
        const now = new Date();
        const currentYear = now.getFullYear();

        if (["agricole"].includes(location.usage)) {
            exercice = "annuelle";
            periode = `${currentYear - 1}-${currentYear}`; // ex: 2024-2025
        } else {
            exercice = "semestrielle";
            // Déterminer 1er ou 2e semestre selon le mois
            const month = now.getMonth() + 1; // 1 → janvier, 12 → décembre
            periode = month <= 6 ? `1er semestre ${currentYear}` : `2e semestre ${currentYear}`;
        }

        // Facture
        const facture = `${location.codeLocation}/TER/2025`;

        // Ensuite on les passe à drawHeaderRow
        drawHeaderRow(
            doc,
            yHeader,
            "", // chemin logo
            "RESEAU NATIONAL DES CHEMINS DE FER MALAGASY\nDIRECTION DE LA LIGNE FERROVIAIRE\n FIANARANTSOA COTE-EST",
            [
                `DM : 04`,
                `FACTURE : ${facture}`,
                `EXERCICE : ${exercice}`,
                `PERIODE : ${periode}`
            ]
        );

        doc.moveDown(1.5); // espace entre le header et le tableau principal

        // --- BLOC INFOS GÉNÉRALES ---
        doc.fontSize(10);

        // Valeurs pour les infos
        const compteADebiter = `Compte à débiter :  `;
        const compteACrediter = "Compte à créditer : 0009 02000 1 294564 000 0 – 88";
        const convention = `${station.codeStation}/${location.codeLocation}/${currentYear}`;
        const perception = location.placePaymment || "";
        const codeTarif = "";
        const codeGare = ` Code gare: ${String(station.codeStation)}`;
        const destination = `Destination :${location.placePaymment || ""}`;

        // Dessin des lignes infos
        let y = doc.y;

        drawInfoRow(doc, y, compteADebiter, codeGare, `Nom du locataire : ${tenant.name}`);
        drawInfoRow(doc, y + 20, compteACrediter, destination, "");
        drawInfoRow(doc, y + 40, `Convention : ${convention}`, `PK Com : ${land.startPk}`, "");
        drawInfoRow(doc, y + 60, `Perception : ${perception}`, `PK Fin : ${land.endPk}`, `Adresse : ${tenant.address}`);
        drawInfoRow(doc, y + 80, `Code tarif : ${codeTarif}`, `Superficie : ${land.area ?? 0}`, "");

        doc.moveDown(2);

        // --- TABLEAU PRINCIPAL ---
        doc.fontSize(12)
            .text("LOCATION TERRAIN", 50, doc.y, { continued: true })
            .text("MONTANT (Ar)", { align: "right" });

        doc.moveDown(0.5);
        doc.fontSize(11);
        drawRow(doc, doc.y, "TYPE DE LOCATION", "SUPERFICIE", "PU (Ar/m2)", "MONTANT");
        doc.moveDown(0.5);

        doc.fontSize(10);

        const items = [
            [
                "Usage habitation",
                location.usage === "Habitation" ? (Number(location.areaWood) + Number(location.areaPermanent)) : "",
                location.usage === "Habitation" ? (Number(location.priceWood) + Number(location.pricePermanent)) : "",
            ],
            [
                "Usage commercial",
                location.usage === "Commerciale" ? (Number(location.areaWood) + Number(location.areaPermanent)) : "",
                location.usage === "Commerciale" ? (Number(location.priceWood) + Number(location.pricePermanent)) : "",
            ],
            [
                "Usage agricole",
                location.usage === "Agricole" ? Number(land.area) : "",
                location.usage === "Agricole" ? location.priceLandBare : "",
            ],
            [
                "Usage culturel",
                location.usage === "Culturel" ? (Number(location.areaWood) + Number(location.areaPermanent)) : "",
                location.usage === "Culturel" ? (Number(location.priceWood) + Number(location.pricePermanent)) : "",
            ],
            [
                "Terrain nu A.D",
                location.usage === "Commerciale" || location.usage === "Habitation" || location.usage === "Culturel" ? Number(location.areaLandBare) : "",
                location.usage === "Commerciale" || location.usage === "Habitation" || location.usage === "Culturel" ? location.priceLandBare : "",
            ],
        ];


        let currentY = doc.y;
        let totalHorsTVA = 0;

        items.forEach(([label, area, pu]) => {
            const superficie = Number(area) || 0;
            const montant = Number(pu) || 0; // pu ici = PU × superficie
            const puUnit = superficie !== 0 ? montant / superficie : 0;

            totalHorsTVA += montant; // somme totale des MONTANT

            drawRow(doc, currentY, label, superficie, puUnit, montant);
            currentY += 20;
        });


        // --- Totaux ---
        const tva = totalHorsTVA * 0.2;
        const totalTTC = totalHorsTVA + tva;

        currentY += 10;
        drawRow(doc, currentY, "TOTAL hors TVA", "", "", totalHorsTVA);
        currentY += 20;
        drawRow(doc, currentY, "TVA 20%", "", "", tva);
        currentY += 20;
        drawRow(doc, currentY, "TOTAL TTC", "", "", totalTTC);
        currentY += 20;

        // Affichage TOTAL TTC en grand dans la colonne MONTANT
        doc.fontSize(16).font("Helvetica-Bold");
        doc.text(totalTTC.toString(), 500, currentY - 100, { align: "right" }); // monte de 5 pts


        // Remettre la taille normale pour la suite
        doc.fontSize(10).font("Helvetica");

        // --- PAGE COPIE ---
        doc.addPage();
        doc.fontSize(16).text("CONVENTION DE LOCATION (copie)", { align: "center" });
        doc.moveDown(1);

        // Tu peux répéter les mêmes tableaux ici si nécessaire

        doc.end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};
/*
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

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=facture_${location.codeLocation}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(12);

        // En-tête
        doc.text(`Compte à débiter : ____________________`, 50, 50);
        doc.text(`Code Gare : ${station.codeStation}`, 300, 50);
        doc.text(`NOM du locataire : ${tenant.name} ${tenant.lastName}`, 450, 50);

        doc.text(`Compte à créditer : ____________________`, 50, 70);
        doc.text(`Destination : ${location.placePaymment}`, 300, 70);

        doc.text(`Convention : ____________________`, 50, 90);
        doc.text(`PK Com : ${land.startPk}`, 300, 90);

        doc.text(`Perception : ____________________`, 50, 110);
        doc.text(`PK Fin : ${land.endPk}`, 300, 110);
        doc.text(`ADRESSE du locataire : ${tenant.address}`, 450, 110);

        doc.text(`Code tarif : ____________________`, 50, 130);
        doc.text(`Superficie : ${location.areaLandBare + location.areaPermanent + location.areaWood}`, 300, 130);

        doc.moveDown(2);

        // Tableau principal
        doc.text("LOCATION TERRAIN", 50, 160, { underline: true });
        doc.text("MONTANT(Ar)", 400, 160, { underline: true });

        doc.moveDown(1);
        const tableTop = 180;

        const rowSpacing = 20;
        const usages = [
            { type: "Usage habitation", area: land.area || 0, price: location.codeLocation || 0 },
            { type: "Usage commercial", area: land.area || 0, price: location.codeLocation || 0 },
            { type: "Usage agricole", area: land.area || 0, price: location.codeLocation || 0 },
            { type: "Usage culturel", area: land.area || 0, price: location.codeLocation || 0 },
            { type: "Terrain nu A.D", area: land.area, price: location.priceLandBare },
        ];

        usages.forEach((u, i) => {
            const y = tableTop + i * rowSpacing;
            doc.text(u.type, 50, y);
            doc.text(u.area.toString(), 200, y);
            doc.text(u.price.toString(), 300, y);
            doc.text((u.area * u.price).toString(), 400, y);
        });

        // Totaux
        const totalHorsTva = usages.reduce((acc, u) => acc + u.area * u.price, 0);
        const tva = totalHorsTva * 0.2;
        const totalTtc = totalHorsTva + tva;

        doc.text(`TOTAL hors TVA : ${totalHorsTva}`, 50, tableTop + usages.length * rowSpacing + 20);
        doc.text(`TVA 20% : ${tva}`, 50, tableTop + usages.length * rowSpacing + 40);
        doc.text(`TOTAL TTC : ${totalTtc}`, 50, tableTop + usages.length * rowSpacing + 60);

        doc.end();

        if (req.userMatricule && location.codeLocation !== undefined) {
            await logActivity(req.userMatricule, "FACTURE", "Location", location.codeLocation.toString());
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur lors de la génération de la facture" });
    }
};
*/
