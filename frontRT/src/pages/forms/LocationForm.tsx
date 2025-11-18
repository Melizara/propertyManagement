import { useState, useEffect } from "react";
import axios from "../../axios";

function LocationForm() {
    const [locataires, setLocataires] = useState([]);
    const [terrains, setTerrains] = useState([]);
    const [selectedTerrain, setSelectedTerrain] = useState(null);
    const [usage, setUsage] = useState("");
    const [surfaceSousUsage, setSurfaceSousUsage] = useState({});
    const [prixUnitaire, setPrixUnitaire] = useState({});
    const [typePaiement, setTypePaiement] = useState("");
    const [moyenPaiement, setMoyenPaiement] = useState("Banque");

    useEffect(() => {
        const fetchData = async () => {
            const locRes = await axios.get("/locataires");
            const terrainRes = await axios.get("/terrains");
            setLocataires(locRes.data);
            setTerrains(terrainRes.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setTypePaiement(usage === "agricole" ? "annuelle" : usage ? "semestrielle" : "");
    }, [usage]);

    const handleInputChange = (setter, sub) => (e) => {
        const value = parseFloat(e.target.value) || 0;
        setter(prev => ({ ...prev, [sub]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            cin: e.target.cin.value,
            codeLand: e.target.codeLand.value,
            usage,
            surfaceSousUsage,
            prixUnitaire,
            typePaiement,
            moyenPaiement,
            lieuPaiement: selectedTerrain?.gare.nom || "",
            surfaceTotal: selectedTerrain?.surface || 0
        };
        console.log("Données à envoyer :", data);
    };

    const sousUsages = ["terrain nu", "construction bois", "construction dure"];
    const afficherSousUsage = ["commerciale", "habitation", "culturel"].includes(usage);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Formulaire Location</h2>
            <form onSubmit={handleSubmit}>
                {/* CIN et Terrain sur la même ligne */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">CIN Locataire</label>
                        <select name="cin" className="form-control" required>
                            <option value="">Sélectionner</option>
                            {locataires.map(loc => (
                                <option key={loc.cin} value={loc.cin}>{loc.cin} - {loc.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Terrain</label>
                        <select
                            name="codeLand"
                            className="form-control"
                            required
                            onChange={(e) => setSelectedTerrain(terrains.find(t => t.codeLand === parseInt(e.target.value)))}
                        >
                            <option value="">Sélectionner</option>
                            {terrains.map(t => (
                                <option key={t.codeLand} value={t.codeLand}>{t.nom} - Secteur: {t.gare.nom}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">

                <div className="col-md-6">
                    <label className="form-label">Usage</label>
                    <select className="form-control" value={usage} onChange={(e) => setUsage(e.target.value)} required>
                        <option value="">Sélectionner</option>
                        <option value="agricole">Agricole</option>
                        <option value="commerciale">Commerciale</option>
                        <option value="culturel">Culturel</option>
                        <option value="habitation">Habitation</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Surface totale du terrain</label>
                    <input
                        type="number"
                        className="form-control"
                        value={selectedTerrain?.surface || ""}
                        readOnly
                    />
                </div>
                </div>

                {afficherSousUsage && (
                    <>
                        <div className="row mb-3">
                            {sousUsages.map(sub => (
                                <div key={sub} className="col-md-4">
                                    <label className="form-label">Surface {sub}</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={surfaceSousUsage[sub] || ""}
                                        onChange={handleInputChange(setSurfaceSousUsage, sub)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="row mb-3">
                            {sousUsages.map(sub => (
                                <div key={sub} className="col-md-4">
                                    <label className="form-label">Prix unitaire {sub}</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={prixUnitaire[sub] || ""}
                                        onChange={handleInputChange(setPrixUnitaire, sub)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Type de paiement</label>
                        <input type="text" className="form-control" value={typePaiement} readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Moyen de paiement</label>
                        <select className="form-control" value={moyenPaiement} onChange={(e) => setMoyenPaiement(e.target.value)} required>
                            <option value="Banque">Banque</option>
                            <option value="Caisse">Caisse</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Lieu de paiement</label>
                    <input type="text" className="form-control" value={selectedTerrain?.gare.nom || ""} readOnly />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary px-5">Ajouter</button>
                </div>
            </form>
        </div>
    );
}

export default LocationForm;
