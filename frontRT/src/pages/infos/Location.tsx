import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import axios from "../../axios.tsx";
import { deleteLocation } from "../../features/locationSlice.tsx";
import { FaArrowLeft } from "react-icons/fa";

function Location() {
    interface LocationType {
        codeLocation?: number;
        cin: string;
        codeLand: number;
        usage: string;
        areaLandBare: number;
        areaWood: number;
        areaPermanent: number;
        priceLandBare: number;
        priceWood: number;
        pricePermanent: number;
        typePayment: string;
        methodPayment: string;
        placePaymment: string;
        userMatricule: string;
    }

    interface User {
        matricule: string;
        pseudo: string;
        email: string;
        poste: "operateur de saisie" | "admin" | "caissier";
    }

    const user = useSelector((state: RootState) => state.auth.data) as User | null;
    const { codeLocation } = useParams<{ codeLocation: string }>();
    const [location, setLocation] = useState<LocationType | null>(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/locations/${codeLocation}`)
            .then((res) => {
                setLocation(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [codeLocation]);

    const handleDelete = async (codelocation: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette location ?")) {
            await dispatch(deleteLocation(codelocation));
            navigate("/location");
        }
    };

    if (loading) {
        return (
            <div className="container-lg my-5 text-center">
                <h3 className="text-secondary fw-bold fs-4">Chargement...</h3>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="container-lg my-5 text-center">
                <h3 className="text-danger">Aucune location trouvée.</h3>
            </div>
        );
    }

    return (
        <div className="container-lg my-5 d-flex justify-content-center">
            <div className="card shadow-sm w-75 p-4 border-0">
                <button
                    type="button"
                    className="btn btn-outline-secondary mb-3 d-flex align-items-center"
                    onClick={() => navigate("/location")}
                    style={{ width: "fit-content" }}
                >
                    <FaArrowLeft className="me-2" /> Retour
                </button>

                <h2 className="text-center fw-bold mb-4 text-primary">
                    Fiche de la location
                </h2>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <strong>CIN :</strong> {location.cin}
                    </div>
                    <div className="col-md-6 mb-3">
                        <strong>Code du terrain :</strong> {location.codeLand}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Usage :</strong> {location.usage}
                    </div>
                    <div className="col-md-6 mb-3">
                        <strong>Type de paiement :</strong> {location.typePayment}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Méthode de paiement :</strong> {location.methodPayment}
                    </div>
                    <div className="col-md-6 mb-3">
                        <strong>Lieu de paiement :</strong> {location.placePaymment}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Surface Terrain Nu :</strong> {location.areaLandBare} m²
                    </div>
                    <div className="col-md-6 mb-3">
                        <strong>Prix Terrain Nu :</strong> {location.priceLandBare}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Surface Bois :</strong> {location.areaWood} m²
                    </div>
                    <div className="col-md-6 mb-3">
                        <strong>Prix Bois :</strong> {location.priceWood}
                    </div>

                    <div className="col-md-6 mb-3">
                        <strong>Surface Dure :</strong> {location.areaPermanent} m²
                    </div>
                    <div className="col-md-6 mb-3">
                        <strong>Prix Dure :</strong> {location.pricePermanent}
                    </div>
                </div>


                {user && user.matricule === location.userMatricule && (
                    <div className="d-flex justify-content-center mt-4">
                        <Link to={`/updateLocation/${location.codeLocation}`}>
                            <button className="btn btn-outline-secondary me-2">Modifier</button>
                        </Link>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(location.codeLocation!)}
                        >
                            Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Location;
