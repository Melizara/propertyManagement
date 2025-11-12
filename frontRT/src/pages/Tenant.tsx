import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../apps/Store.tsx";
import axios from "../axios.tsx"
import { deleteTenant } from "../features/tenantSlice.tsx";


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
        matricule: string; // PK
        pseudo: string;
        email: string;
        poste: "operateur de saisie" | "admin" | "caissier";
    }
    const user = useSelector((state: RootState) => state.auth.data) as User | null;
    const { cin } = useParams<{ cin: string }>();

    const [tenant, setTenant] = useState<TenantType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/tenants/${cin}`)
            .then((res) => {
                setTenant(res.data); // si res.data est un objet, pas besoin de [0]
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [cin]);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleDelete = async (cin: number) => {
        if (window.confirm("sure?")) {
            await dispatch(deleteTenant(cin));
            navigate("/locataire");
        }
    };

    // console.log("user id:", user?.id);
    // console.log("author id:", story?.authorId);

    return (
        <div className="container-lg my-5">
            {loading ? (<div>
                <h3 className="text-secondary fw-bold fs-4">Wait...</h3>
            </div>) :
                (<div className="row text-center justify-content-center">
                    <div className="rounded">
                        rounded
                    </div>
                    <h2 className="lead fw-bold mt-5">{tenant?.name || "Nom indisponible"}</h2>
                    {user && user?.matricule === tenant?.userMatricule && (
                        <div className="mt-3">
                            <div className="d-flex flex-row justify-content-center text-center">
                                <div>
                                    <Link to={`/updateTenant/${tenant.cin}`}>
                                        <button className="btn btn-secondary">
                                            Edit
                                        </button>
                                    </Link>
                                </div>
                                <div>
                                    <button className="btn btn-danger ms-2" onClick={() => handleDelete(tenant.cin)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <p>Auteur : {tenant?.user?.pseudo || "Inconnu"}</p>
                    <p className="text-secondary lead fw-bold mt-2" ><FaEye className="me-2" />Vue par</p>
                    <p className="lead mt3">{tenant?.name || "Texte indisponible"}</p>
                </div>)
            }
        </div>
    )
}

export default Tenant;