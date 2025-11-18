import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import type { RootState } from "../../apps/Store.tsx";
import type { FormEvent } from "react";
import { AxiosError } from "axios";

type IPrice = {
    codePrice?: number;
    secteur: string;
    usage: string;
    sousUsage: string;
    prix: number;
    userMatricule: string;
};

type LandWithStation = {
    codeLand: string;
    area: number;
    station: {
        type: string;
    };
};

function LocationForm() {
    const user = useSelector((state: RootState) => state.auth.data);

    const [cin, setCin] = useState("");
    const [codeLand, setCodeLand] = useState("");
    const [usage, setUsage] = useState("");
    const [areaLandBare, setAreaLandBare] = useState("");
    const [areaWood, setAreaWood] = useState("");
    const [areaPermanent, setAreaPermanent] = useState("");
    const [priceLandBare, setPriceLandBare] = useState("");
    const [priceWood, setPriceWood] = useState("");
    const [pricePermanent, setPricePermanent] = useState("");
    const [typePayment, setTypePayment] = useState("");
    const [methodPayment, setMethodPayment] = useState("");
    const [placePaymment, setPlacePaymment] = useState("");

    const { codeLocation } = useParams<{ codeLocation: string }>();
    const isUpdate = Boolean(codeLocation);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [tenants, setTenants] = useState<{ cin: string, name: string }[]>([]);
    const [lands, setLands] = useState<LandWithStation[]>([]);

    // Hooks pour les prix
    const [prices, setPrices] = useState<IPrice[]>([]);
    const [sector, setSector] = useState("");


    // Récupérer tous les prix et terrains
    useEffect(() => {
        axios.get("/api/prices").then(({ data }) => setPrices(data)).catch(console.log);
        axios.get("/api/lands").then(({ data }) => {
            // data[i].station.secteur est le secteur
            setLands(data);
        }).catch(console.log);

    }, []);

    // Quand on change le codeLand, récupérer son secteur
    useEffect(() => {
        const land = lands.find(l => String(l.codeLand) === String(codeLand));
        // console.log("LAND FOUND:", land);
        // console.log("STATION RECEIVED:", land?.station);
        if (land) setSector(land.station?.type || "");
    }, [codeLand, lands]);

    // Calcul automatique des prix quand usage ou surface change
    useEffect(() => {
        if (!usage || !sector) return;

        if (usage.toLowerCase() === "agricole") {
            const prixAgricole = prices.find(
                p => p.secteur === sector && p.usage === "Agricole"
            )?.prix || 0;

            const land = lands.find(l => String(l.codeLand) === String(codeLand));
            if (land) {
                const total = land.area * prixAgricole;
                setPriceLandBare(total.toString());
            }

            setPriceWood("0");
            setPricePermanent("0");
            return;
        }


        const prixTerrainNu = prices.find(
            p => p.secteur === sector && p.usage === usage && p.sousUsage.toLowerCase() === "terrain nu"
        )?.prix || 0;

        const prixBois = prices.find(
            p => p.secteur === sector && p.usage === usage && p.sousUsage.toLowerCase() === "construction bois"
        )?.prix || 0;

        const prixDure = prices.find(
            p => p.secteur === sector && p.usage === usage && p.sousUsage.toLowerCase() === "construction dure"
        )?.prix || 0;

        setPriceLandBare((Number(areaLandBare) * prixTerrainNu).toString());
        setPriceWood((Number(areaWood) * prixBois).toString());
        setPricePermanent((Number(areaPermanent) * prixDure).toString());
    }, [usage, sector, areaLandBare, areaWood, areaPermanent, prices, codeLand, lands]);



    // Récupérer tenants et lands pour les selects
    useEffect(() => {
        axios.get("/api/tenants").then(({ data }) => setTenants(data)).catch(console.log);
        axios.get("/api/lands").then(({ data }) => setLands(data)).catch(console.log);
    }, []);

    useEffect(() => {
        if (codeLocation) {
            axios.get(`/api/locations/${codeLocation}`)
                .then(({ data }) => {
                    setCin(data.cin);
                    setCodeLand(data.codeLand);
                    setUsage(data.usage);
                    setAreaLandBare(data.areaLandBare);
                    setAreaWood(data.areaWood);
                    setAreaPermanent(data.areaPermanent);
                    setPriceLandBare(data.priceLandBare);
                    setPriceWood(data.priceWood);
                    setPricePermanent(data.pricePermanent);
                    setTypePayment(data.typePayment);
                    setMethodPayment(data.methodPayment);
                    setPlacePaymment(data.placePaymment);
                })
                .catch(console.log);
        }
    }, [codeLocation]);

    useEffect(() => {
        if (usage.toLowerCase() === "agricole") {
            setTypePayment("Annuelle");
        } else if (usage) {
            setTypePayment("Semestrielle");
        }
    }, [usage]);

    if (!user && !window.localStorage.getItem("token")) return <Navigate to="/login" />;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);

            const locationData = {
                cin,
                codeLand,
                usage,
                areaLandBare,
                areaWood,
                areaPermanent,
                priceLandBare,
                priceWood,
                pricePermanent,
                typePayment,
                methodPayment,
                placePaymment,
                userMatricule: user?.matricule
            };

            if (isUpdate) {
                await axios.put(`/api/locations/${codeLocation}`, locationData);
            } else {
                await axios.post("/api/locations", locationData);
                window.alert("Location ajoutée avec succès !");
            }

            navigate("/location");
        } catch (error) {
            const axiosError = error as AxiosError<{ error: string }>;
            console.log(axiosError.response?.data?.error || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-lg my-5">
            <div className="mb-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/locations")}>
                    ← Retour
                </button>
            </div>

            <h2 className="text-center mb-5 fw-bold">Formulaire Location</h2>

            <form onSubmit={handleSubmit}>
                {/* CIN et CodeLand */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">CIN</label>
                        <select className="form-select" value={cin} onChange={e => setCin(e.target.value)} required>
                            <option value="">Sélectionnez le CIN</option>
                            {tenants.map(t => <option key={t.cin} value={t.cin}>{t.cin} - {t.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Code Land</label>
                        <select className="form-select" value={codeLand} onChange={e => setCodeLand(e.target.value)} required>
                            <option value="">Sélectionnez le terrain</option>
                            {lands.map(l => <option key={l.codeLand} value={l.codeLand}>{l.codeLand} - {l.area} m²</option>)}
                        </select>
                    </div>
                </div>

                {/* Usage */}
                <div className="mb-3">
                    <label className="form-label">Usage</label>
                    <select className="form-select" value={usage} onChange={e => setUsage(e.target.value)} required>
                        <option value="">Sélectionnez</option>
                        <option value="Agricole">Agricole</option>
                        <option value="Commerciale">Commerciale</option>
                        <option value="Culturel">Culturel</option>
                        <option value="Habitation">Habitation</option>
                    </select>

                </div>

                {/* Surfaces et prix */}
                {usage !== "Agricole" && (
                    <>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Surface Terrain Nu</label>
                                <input type="text" className="form-control" value={areaLandBare} onChange={e => setAreaLandBare(e.target.value)} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Surface Bois</label>
                                <input type="text" className="form-control" value={areaWood} onChange={e => setAreaWood(e.target.value)} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Surface Dure</label>
                                <input type="text" className="form-control" value={areaPermanent} onChange={e => setAreaPermanent(e.target.value)} required />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Prix Terrain Nu</label>
                                <input type="text" className="form-control" value={priceLandBare} onChange={e => setPriceLandBare(e.target.value)} readOnly />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Prix Bois</label>
                                <input type="text" className="form-control" value={priceWood} onChange={e => setPriceWood(e.target.value)} readOnly />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Prix Dure</label>
                                <input type="text" className="form-control" value={pricePermanent} onChange={e => setPricePermanent(e.target.value)} readOnly />
                            </div>
                        </div>
                    </>
                )}

                {usage === "Agricole" && (
                    <div className="mb-3">
                        <label className="form-label">Prix Total Agricole</label>
                        <input type="text" className="form-control" value={priceLandBare} readOnly />
                    </div>
                )}

                {/* Paiement */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Type de paiement</label>
                        <input type="text" className="form-control" value={typePayment} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Méthode de paiement</label>
                        <select className="form-select" value={methodPayment} onChange={e => setMethodPayment(e.target.value)} required>
                            <option value="">Sélectionnez</option>
                            <option value="Bancaire">Bancaire</option>
                            <option value="Liquide">Liquide</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Lieu de paiement</label>
                        <input type="text" className="form-control" value={placePaymment} onChange={e => setPlacePaymment(e.target.value)} required />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                        {loading ? "Enregistrement..." : isUpdate ? "Mettre à jour" : "Publier"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LocationForm;