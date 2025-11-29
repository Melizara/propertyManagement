import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../apps/Store";
import type { AppDispatch } from "../../apps/Store";
import { fetchStations } from "../../features/stationSlice.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRight, Layers3, MapPin, PlusCircle, Train } from "lucide-react";

function HomeStation() {
    const user = useSelector((state: RootState) => state.auth.data);
    const { stations, status } = useSelector((state: RootState) => state.stations);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchStations());
    }, [dispatch]);

    const handleAddStations = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/stations",
                {}, // corps vide car ton controller ne prend rien
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ); // endpoint pour createStation
            dispatch(fetchStations()); // rafraîchir la liste après ajout
            toast.success("Toutes les gares ont été ajoutées !");
        } catch (error) {
            console.error(error);
            toast.success("Erreur lors de l'ajout des gares !");
        }
    };

    return (
        <div className="container-lg my-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb py-2 px-3 rounded-3">
                    <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                        <Link to="/" className="text-decoration-none text-secondary">
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2 mt-1">{" > "}</span>
                    <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
                        Gares
                    </li>
                </ol>
            </nav>

            {/* Ajouter bouton */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <button
                        onClick={handleAddStations}
                        className="btn btn-primary d-flex align-items-center gap-2"
                        style={{
                            visibility: user && user.poste === "admin" ? "visible" : "hidden"
                        }}
                    >
                        <PlusCircle size={18} />
                        Ajouter les gares
                    </button>
                </div>
            </div>


            {/* Status */}
            {status === "loading" && (
                <div className="text-center mt-5">
                    <h3 className="text-secondary fw-bold fs-4">Chargement ...</h3>
                </div>
            )}
            {status === "error" && (
                <div className="text-center mt-5">
                    <h3 className="text-secondary fw-bold fs-4">Une erreur est survenue</h3>
                </div>
            )}

            {/* Cards */}
            <div className="row g-4">
                {status === "success" &&
                    stations.map((station) => (
                        <div key={station.codeStation} className="col-12 col-md-6 col-lg-3">

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
                                    <Train size={25} /> {/* icône gauche */}
                                    <h5 className="mb-0 text-center flex-grow-1 fs-5">{station.name}</h5>
                                </div>

                                {/* Body */}
                                <div className="card-body">
                                    <div className="d-flex mb-3 align-items-center">
                                        <div className="p-2 bg-light rounded me-2">
                                            <Layers3 size={18} className="text-primary" /> {/* icône cohérente */}
                                        </div>
                                        <div>
                                            <small className="text-secondary text-uppercase fw-bold">Type</small>
                                            <p className="mb-0 fw-semibold">{station.type}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex mb-3 align-items-center">
                                        <div className="p-2 bg-light rounded me-2">
                                            <MapPin size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <small className="text-secondary text-uppercase fw-bold">Point kilométrique</small>
                                            <p className="mb-0 fw-semibold d-flex align-items-center gap-1">
                                                <span className="text-secondary fw-bold">{station.startPk}</span>
                                                <ArrowRight size={16} className="text-secondary" />
                                                <span className="text-secondary fw-bold">{station.endPk}</span>
                                                <span className="text-muted"> km</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default HomeStation;
