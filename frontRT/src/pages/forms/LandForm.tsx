import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import axios from "../../axios";
import type { RootState } from "../../apps/Store.tsx";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

interface LandFormProps {
    onSuccess?: () => void;
    isModal?: boolean; // <-- nouveau prop
}


function LandForm({ onSuccess, isModal }: LandFormProps) {
    const user = useSelector((state: RootState) => state.auth.data);

    const { codeLand: codeLandParam } = useParams<{ codeLand: string }>();
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [startPk, setStartPk] = useState("");
    const [endPk, setEndPk] = useState("");
    const [railwaySide, setRailwaySide] = useState("");
    const [position, setPosition] = useState("");
    const [neighborHood, setNeighborHood] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [stationName, setStationName] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isUpdate = Boolean(codeLandParam);

    useEffect(() => {
        if (codeLandParam) {
            axios.get(`/api/lands/${codeLandParam}`)
                .then(({ data }) => {
                    setLength(data.length);
                    setWidth(data.width);
                    setStartPk(data.startPk);
                    setEndPk(data.endPk);
                    setRailwaySide(data.railwaySide);
                    setPosition(data.position);
                    setNeighborHood(data.neighborHood);
                    setMunicipality(data.municipality);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [codeLandParam]); // <-- important


    useEffect(() => {
        const fetchStation = async () => {
            if (!startPk || !endPk) {
                setStationName("");
                return;
            }
            try {
                const res = await axios.get("/api/lands/station", {
                    params: { startPk, endPk },
                });
                setStationName(res.data.name); // nom de la gare récupéré
            } catch (err) {
                console.log(err);
                setStationName(""); // pas de gare trouvée
            }
        };

        fetchStation();
    }, [startPk, endPk]);



    if (!user && !window.localStorage.getItem("token")) return <Navigate to="/login" />

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const landData = {
                length,
                width,
                startPk,
                endPk,
                railwaySide,
                position,
                neighborHood,
                municipality,
                userMatricule: user?.matricule,
            };
            if (isUpdate) {
                await axios.put(`/api/lands/${codeLandParam}`, landData);
                toast.success("Terrain modifié avec succès !");
            } else {
                await axios.post("/api/lands", landData);
                toast.success("Terrain ajouté avec succès !");
                if (onSuccess) onSuccess();
            }
            navigate("/terrain")
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-lg my-5">
            {!isModal && (
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb py-2 px-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                        <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                            <Link to="/" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
                                Accueil
                            </Link>
                        </li>
                        <span className="mx-2 mt-1">{" > "}</span>
                        <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                            <Link to="/terrain" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
                                Terrains
                            </Link>
                        </li>
                        <span className="mx-2 mt-1">{" > "}</span>
                        <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
                            Formulaire
                        </li>
                    </ol>
                </nav>
            )}

            <div className="text-center mb-5">
                <h2 className="fw-bold">Formulaire Terrain</h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Nom et Prénom */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Longueur</label>
                        <input type="text" className="form-control" value={length}
                            maxLength={6}
                            onChange={(e) => setLength(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Largeur</label>
                        <input type="text" className="form-control" value={width}
                            maxLength={4}
                            onChange={(e) => setWidth(e.target.value)} required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Pk debut</label>
                        <input type="text" className="form-control" value={startPk}
                            maxLength={3}
                            onChange={e => setStartPk(e.target.value)}
                            required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Pk fin</label>
                        <input type="text" className="form-control" value={endPk}
                            maxLength={3}
                            onChange={(e) => setEndPk(e.target.value)} required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Railway side</label>
                        <select
                            className="form-control"
                            value={railwaySide}
                            onChange={(e) => setRailwaySide(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner</option>
                            <option value="gauche">Gauche</option>
                            <option value="droite">Droite</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Position</label>
                        <select
                            className="form-control"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>
                </div>
                {/* Adresse */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Quartier</label>
                        <input type="text" className="form-control" value={neighborHood}
                            maxLength={30}
                            onChange={e => {
                                const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setNeighborHood(lettersOnly);
                            }} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Commune</label>
                        <input type="text" className="form-control" value={municipality}
                            maxLength={30}
                            onChange={e => {
                                const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setMunicipality(lettersOnly);
                            }} required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <label className="form-label">Gare occupée</label>
                        <input type="text" className="form-control" value={stationName} readOnly />
                    </div>
                </div>

                {/* Bouton */}
                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                        {loading ? "Enregistrement..." : isUpdate ? "Mettre à jour" : "Publier"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LandForm;
