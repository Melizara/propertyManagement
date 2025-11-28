import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../apps/Store";
import type { AppDispatch } from "../../apps/Store";
import { fetchStations } from "../../features/stationSlice.tsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb" style={{ backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "5px" }}>
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gares</li>
                </ol>
            </nav>
            <div className="row align-items-center align-content-center">
                <div className="col-md-6 mt-5 mt-md-0 order-md-first">
                    <div>
                        
                        {user && user.poste === "admin" && (
                            <button
                                onClick={handleAddStations}
                                className="btn btn-success mt-3"
                            >
                                Ajouter les gares
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="my-5">
                

                {status === "loading" && (
                    <div className="text-center mt-5">
                        <h3 className="text-secondary fw-bold fs-4">
                            Chargement ...
                        </h3>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center mt-5">
                        <h3 className="text-secondary fw-bold fs-4">
                            Une erreur est survenue
                        </h3>
                    </div>
                )}

                <div className="row">
                    {status === "success" && stations.map((station) => (
                        <div key={station.codeStation} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header text-white bg-primary text-center">
                                    <h5 className="fw-bold mb-0">{station.name}</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>Type :</strong> {station.type}</p>
                                    <p><strong>PK début :</strong> {station.startPk} km</p>
                                    <p><strong>PK fin :</strong> {station.endPk} km</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default HomeStation;
