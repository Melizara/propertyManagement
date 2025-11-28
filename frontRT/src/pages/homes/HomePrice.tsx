import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../apps/Store";
import { fetchPrices } from "../../features/priceSlice"; // ton slice pour les prix
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
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
                <ol className="breadcrumb" style={{ backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "5px" }}>
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Prix</li>
                </ol>
            </nav>
            <div className="text-center mb-4">
                {user && user.poste === "admin" && (
                    <button onClick={handleAddPrices} className="btn btn-success">
                        Ajouter tous les prix
                    </button>
                )}
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
                <div className="row">
                    {prices.map((price) => (
                        <div className="col-md-4 mb-4" key={price.codePrice}>
                            <div className="card shadow-sm border-0 rounded-3 h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-primary fw-bold">
                                        {price.secteur}
                                    </h5>
                                    <p className="card-text mb-1">
                                        <strong>Usage : </strong>{price.usage}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Sous-usage : </strong>{price.sousUsage || "-"}
                                    </p>
                                    <p className="card-text fw-bold fs-5 mt-3 text-success">
                                        {price.prix.toLocaleString()} Ar
                                    </p>
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
