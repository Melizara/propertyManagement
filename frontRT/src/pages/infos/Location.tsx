import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import axios from "../../axios.tsx";
import { deleteLocation } from "../../features/locationSlice.tsx";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

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
        statusPayment: boolean;
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
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous allez supprimer cet location !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#007bff",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmer",
            cancelButtonText: "Annuler",
            reverseButtons: false,
            focusCancel: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await dispatch(deleteLocation(codelocation));
                navigate("/location");
                toast.success("Locataire supprimé avec succès !");
            }
        });
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
                <div className="mt-3">
                    <strong>Status du paiement :</strong>{" "}
                    {location.statusPayment ? "Payé ✅" : "Non payé ❌"}
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

                {user?.poste === "operateur de saisie" && (
                    <div className="d-flex justify-content-center mt-3 gap-2">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                                console.log("Télécharger Convention PDF");
                            }}
                        >
                            Convention PDF
                        </button>

                        <button
                            className="btn btn-outline-success"
                            onClick={() => {
                                console.log("Télécharger Facture PDF");
                            }}
                        >
                            Facture PDF
                        </button>
                    </div>
                )}


                {user?.poste === "caissier" && !location.statusPayment && (
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-success"
                            onClick={async () => {
                                if (!location.codeLocation) return;
                                try {
                                    await axios.put(`/api/locations/${location.codeLocation}/pay`);
                                    setLocation({ ...location, statusPayment: true }); // Met à jour l'état local
                                    toast.success("Paiement confirmé !");
                                } catch (err) {
                                    console.error(err);
                                    toast.error("Erreur lors de la confirmation du paiement");
                                }
                            }}
                        >
                            Confirmer le paiement
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Location;
