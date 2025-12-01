import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import axios from "../../axios.tsx";
import { deleteLocation } from "../../features/locationSlice.tsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Pencil, Trash2, FileText, FileCheck, CheckCircle } from "lucide-react";


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
                toast.success("Location supprimé avec succès !");
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
        <div className="container-lg" style={{ marginTop: "-295px" }}>
            {/* Fil d'Ariane */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb py-2 px-3 rounded-3">
                    <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                        <Link to="/" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2 mt-1">{" > "}</span>
                    <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                        <Link to="/location" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
                            Locations
                        </Link>
                    </li>
                    <span className="mx-2 mt-1">{" > "}</span>
                    <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
                        Information du location
                    </li>
                </ol>
            </nav>

            <div className="d-flex justify-content-center">
                <div className="card shadow-sm w-75 p-4 border-1">


                    <h3 className="fs-5 text-center mb-4 text-secondary">
                        Fiche d'information complet du location
                    </h3>

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



                    {user?.poste === "operateur de saisie" && user.matricule === location.userMatricule && (
                        <div className="d-flex justify-content-center mt-3 gap-2">
                            <Link
                                to={`/updateLocation/${location.codeLocation}`}
                                className="btn btn-outline-secondary d-flex align-items-center gap-2 text-decoration-none"
                            >
                                <Pencil size={18} /> Modifier
                            </Link>
                        </div>
                    )}
                    {user?.poste === "admin" && (
                        <div className="d-flex justify-content-center mt-3 gap-2">
                            <button
                                className="btn btn-outline-danger d-flex align-items-center gap-2"
                                onClick={() => handleDelete(location.codeLocation!)}
                            >
                                <Trash2 size={18} /> Supprimer
                            </button>
                        </div>
                    )}

                    {/* --- Boutons PDF visibles seulement par l'opérateur de saisie --- */}
                    {user?.poste === "operateur de saisie" && (
                        <div className="d-flex justify-content-center mt-3 gap-2">

                            {/* Bouton Convention PDF (toujours visible pour operateur de saisie) */}
                            {/* Bouton Convention PDF */}
                            <button
                                className="btn btn-outline-primary d-flex align-items-center gap-2"
                                onClick={async () => {
                                    if (!location?.codeLocation) return;

                                    try {
                                        const response = await axios.get(
                                            `/api/locations/${location.codeLocation}/convention`,
                                            {
                                                responseType: "blob", // Important pour récupérer le PDF
                                            }
                                        );

                                        // Crée un URL pour le blob
                                        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                                        const fileLink = document.createElement("a");
                                        fileLink.href = fileURL;
                                        fileLink.setAttribute(
                                            "download",
                                            `convention_${location.codeLocation}.pdf`
                                        );
                                        document.body.appendChild(fileLink);
                                        fileLink.click();
                                        fileLink.remove();
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Erreur lors du téléchargement du PDF");
                                    }
                                }}
                            >
                                <FileText size={18} /> Convention PDF
                            </button>

                            {/* Bouton Facture PDF (visible seulement si payé) */}
                            {location.statusPayment && (
                                <button
                                    className="btn btn-outline-success d-flex align-items-center gap-2"
                                    onClick={async () => {
                                        if (!location?.codeLocation) return;
                                        try {
                                            const response = await axios.get(
                                                `/api/locations/${location.codeLocation}/facture`,
                                                { responseType: "blob" } // Important pour les fichiers binaires
                                            );

                                            // Créer un blob et déclencher le téléchargement
                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                            const link = document.createElement("a");
                                            link.href = url;
                                            link.setAttribute(
                                                "download",
                                                `facture_${location.codeLocation}.pdf`
                                            );
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                        } catch (error) {
                                            console.error("Erreur lors du téléchargement de la facture :", error);
                                        }
                                    }}
                                >
                                    <FileCheck size={18} /> Facture PDF
                                </button>

                            )}
                        </div>
                    )}

                    {user?.poste === "caissier" && !location.statusPayment && (
                        <div className="d-flex justify-content-center mt-3 gap-2">
                            <button
                                className="btn btn-success d-flex align-items-center gap-2"

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
                                <CheckCircle size={18} /> Confirmer le paiement
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Location;
