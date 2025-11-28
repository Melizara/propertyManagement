import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import axios from "../../axios.tsx";
import { deleteTenant } from "../../features/tenantSlice.tsx";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Tenant() {
    interface TenantType {
        name: string;
        lastName: string;
        birthDate: string;
        birthPlace: string;
        cin: number;
        cinPlace: string;
        dateCin: string;
        father: string;
        mother: string;
        address: string;
        neighborHood: string;
        municipality: string;
        userMatricule: string;
        user?: {
            pseudo: string;
            email: string;
        };
    }

    interface User {
        matricule: string;
        pseudo: string;
        email: string;
        poste: "operateur de saisie" | "admin" | "caissier";
    }

    const user = useSelector((state: RootState) => state.auth.data) as User | null;
    const { cin } = useParams<{ cin: string }>();

    const [tenant, setTenant] = useState<TenantType | null>(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/tenants/${cin}`)
            .then((res) => {
                setTenant(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [cin]);

    const handleDelete = async (cin: number) => {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous allez supprimer ce locataire !",
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
                await dispatch(deleteTenant(cin));
                navigate("/tenant");
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

    if (!tenant) {
        return (
            <div className="container-lg my-5 text-center">
                <h3 className="text-danger">Aucun locataire trouvé.</h3>
            </div>
        );
    }

    return (

        <div className="container-lg my-5">
            {/* Fil d'Ariane */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb" style={{ backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "5px" }}>
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item"><Link to="/tenant">Locataires</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Information du locataire</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-center">
                <div className="card shadow-sm w-75 p-4 border-0">
                    <button
                        type="button"
                        className="btn btn-outline-secondary mb-3 d-flex align-items-center"
                        onClick={() => navigate("/tenant")}
                        style={{ width: "fit-content" }}
                    >
                        <FaArrowLeft className="me-2" /> Retour
                    </button>
                    <h2 className="text-center fw-bold mb-4 text-primary">
                        Fiche du locataire
                    </h2>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <strong>Nom :</strong> {tenant.name}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Prénom :</strong> {tenant.lastName}
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Date de naissance :</strong> {tenant.birthDate}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Lieu de naissance :</strong> {tenant.birthPlace}
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>CIN :</strong> {tenant.cin}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Délivré à :</strong> {tenant.cinPlace}
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Date de délivrance :</strong> {tenant.dateCin}
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Père :</strong> {tenant.father}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Mère :</strong> {tenant.mother}
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Adresse :</strong> {tenant.address}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Quartier :</strong> {tenant.neighborHood}
                        </div>
                        <div className="col-md-6 mb-3">
                            <strong>Commune :</strong> {tenant.municipality}
                        </div>

                        <div className="col-md-12 mt-3 border-top pt-3">
                            <strong>Auteur :</strong>{" "}
                            {tenant.user?.pseudo || "Inconnu"} (
                            {tenant.user?.email || "Email indisponible"})
                        </div>
                    </div>

                    {user && user.matricule === tenant.userMatricule && (
                        <div className="d-flex justify-content-center mt-4">
                            <Link to={`/updateTenant/${tenant.cin}`}>
                                <button className="btn btn-outline-secondary me-2">Modifier</button>
                            </Link>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(tenant.cin)}
                            >
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Tenant;
