import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../apps/Store";
import { fetchLocations } from "../../features/locationSlice";

function HomeLocation() {
    const { locations, status } = useSelector((state: RootState) => state.locations);
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

    // 🔍 Filtrer toutes les valeurs de location (peu importe le champ)
    const filteredLocations = locations.filter((location) => {
        const allData = `
      ${location.codeLocation}
      ${location.codeLand}
      ${location.cin}
      ${location.usage}
      ${location.areaLandBare}
      ${location.areaPermanent}
      ${location.areaWood}
      ${location.pricePermanent}
    `.toLowerCase();

        return allData.includes(search.toLowerCase());
    });

    return (
        <div className="container-lg" style={{ marginTop: "-190px" }}>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb" style={{ backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "5px" }}>
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Locations</li>
                </ol>
            </nav>
            <div className="my-5">
                {/* 🔎 Barre de recherche */}
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-8">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher une location par code, terrain, CIN, usage, surface, prix..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row align-items-center align-content-center">
                    <div className="col-md-6 mt-5 mt-md-0 order-md-first">
                        <div>
                            <Link to={"/formLocation"}>
                                <button className="btn btn-primary px-3 my-3 fw-bold">Ajouter une location</button>
                            </Link>
                        </div>
                    </div>
                </div>

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

                <div className="row">
                    {status === "success" && filteredLocations.map((location) => (
                        <div key={location.codeLocation} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header text-white bg-primary text-center">
                                    <h5 className="fw-bold mb-0">{location.codeLocation} - {location.cin}</h5>
                                </div>
                                <div className="card-body text-start">
                                    <p><strong>Code location :</strong> {location.codeLocation}</p>
                                    <p><strong>Code terrain :</strong> {location.codeLand}</p>
                                    <p><strong>CIN du locataire :</strong> {location.cin}</p>
                                    <p><strong>Usage :</strong> {location.usage}</p>
                                    <p><strong>Surface terrain :</strong> {location.areaLandBare}</p>
                                    <p><strong>Détails :</strong> {location.areaPermanent}, {location.areaWood}, {location.pricePermanent}</p>
                                </div>
                                <div className="card-footer text-center bg-white">
                                    <Link to={`/location/${location.codeLocation}`}>
                                        <button className="btn btn-primary w-75 fw-bold">Voir</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Aucun résultat */}
                    {status === "success" && filteredLocations.length === 0 && (
                        <div className="text-center mt-5">
                            <h4 className="text-secondary">Aucune location trouvée</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomeLocation;
