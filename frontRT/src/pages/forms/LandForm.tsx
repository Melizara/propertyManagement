import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import type { RootState } from "../../apps/Store.tsx";
import type { FormEvent } from "react";

interface LandFormProps {
  onSuccess?: () => void;
}

function LandForm({ onSuccess }: LandFormProps) {
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
                await axios.put(`/api/lands/${codeLandParam}`, landData)
            } else {
                await axios.post("/api/lands", landData);
                window.alert("Terrain ajouté avec succès !");
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
            <div className="text-center mb-5">
                <h2 className="fw-bold">Formulaire Terrain</h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Nom et Prénom */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Longueur</label>
                        <input type="text" className="form-control" value={length}
                            onChange={(e) => setLength(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Largeur</label>
                        <input type="text" className="form-control" value={width}
                            onChange={(e) => setWidth(e.target.value)} required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Pk debut</label>
                        <input type="text" className="form-control" value={startPk}
                            onChange={e => setStartPk(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Pk fin</label>
                        <input type="text" className="form-control" value={endPk}
                            onChange={(e) => setEndPk(e.target.value)} required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Railway side</label>

                        <input type="text" className="form-control" value={railwaySide}
                            onChange={(e) => setRailwaySide(e.target.value)} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Position</label>
                        <input type="text" className="form-control" value={position}
                            onChange={(e) => setPosition(e.target.value)} required />
                    </div>
                </div>
                {/* Adresse */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Quartier</label>
                        <input type="text" className="form-control" value={neighborHood}
                            onChange={e => {
                                const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setNeighborHood(lettersOnly);
                            }} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Commune</label>
                        <input type="text" className="form-control" value={municipality}
                            onChange={e => {
                                const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setMunicipality(lettersOnly);
                            }} required />
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
