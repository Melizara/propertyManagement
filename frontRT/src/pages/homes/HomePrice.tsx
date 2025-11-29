import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../apps/Store";
import { fetchPrices } from "../../features/priceSlice"; // ton slice pour les prix
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Layers, Layers2, PlusCircle, TrainFront } from "lucide-react";
function HomePrice() {
    const user = useSelector((state: RootState) => state.auth.data);
    const { prices, status } = useSelector((state: RootState) => state.prices);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchPrices());
    }, [dispatch]);

    const handleAddPrices = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/prices",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch(fetchPrices());
            toast.success("Tous les prix ont été ajoutés !");
        } catch (error) {
            console.error(error);
            toast.success("Erreur lors de l'ajout des prix !");
        }
    };

    return (
        <div className="container-lg my-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb py-2 px-3 rounded-3">
                    <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                        <Link to="/" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2 mt-1">{" > "}</span>
                    <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
                        Prix
                    </li>
                </ol>
            </nav>
            <div className="mt-2 mb-4">
                <button
                    onClick={handleAddPrices}
                    className="btn btn-success d-flex align-items-center gap-2"
                    style={{
                        visibility: user && user.poste === "admin" ? "visible" : "hidden"
                    }}
                >
                    <PlusCircle size={18} />
                    Ajouter tous les prix
                </button>
            </div>


            {status === "loading" && (
                <div className="text-center mt-5">
                    <h3 className="text-secondary fw-bold fs-4">Chargement ...</h3>
                </div>
            )}

            {status === "error" && (
                <div className="text-center mt-5">
                    <h3 className="text-secondary fw-bold fs-4">
                        Une erreur est survenue
                    </h3>
                </div>
            )}

            {status === "success" && prices.length > 0 && (
                <div className="row g-4">
                    {prices.map((price) => (
                        <div className="col-12 col-md-6 col-lg-3" key={price.codePrice}>
                            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px" }}>
                                {/* Header */}
                                <div
                                    className="p-3 text-white d-flex align-items-center gap-2"
                                    style={{
                                        background: "linear-gradient(90deg, #007bff, #0056b3)",
                                        borderTopLeftRadius: "15px",
                                        borderTopRightRadius: "15px",
                                    }}
                                >
                                    <TrainFront size={25} /> {/* icône gauche */}
                                    <h5 className="mb-0 text-center flex-grow-1 fs-5">{price.secteur}</h5>
                                </div>

                                {/* Body */}
                                <div className="card-body">
                                    <div className="d-flex mb-3 align-items-center">
                                        <div className="p-2 bg-light rounded me-2">
                                            <Layers2 size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <small className="text-secondary text-uppercase fw-bold">Usage</small>
                                            <p className="mb-0 fw-semibold">{price.usage}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex mb-3 align-items-center">
                                        <div className="p-2 bg-light rounded me-2">
                                            <Layers size={18} className="text-success" />
                                        </div>
                                        <div>
                                            <small className="text-secondary text-uppercase fw-bold">Sous-usage</small>
                                            <p className="mb-0 fw-semibold">{price.sousUsage || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-center">
                                        <p className="fw-bold fs-5 text-success mb-0">{price.prix.toLocaleString()} Ar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {status === "success" && prices.length === 0 && (
                <div className="text-center mt-5">
                    <h4 className="text-secondary">Aucun prix trouvé.</h4>
                </div>
            )}
        </div>
    );
}

export default HomePrice;
