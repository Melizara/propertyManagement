import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../apps/Store";
import { fetchLocations } from "../../features/locationSlice";
import { MapPin, Eye, Tag, IdCard, Layers2, DollarSign, FileCheck2, Search } from "lucide-react";

function HomeLocation() {
    const { locations, status } = useSelector((state: RootState) => state.locations);
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = useState("");
    const user = useSelector((state: RootState) => state.auth.data);

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

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
        <div className="container-lg" style={{ marginTop: "-302px" }}>
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb py-2 px-3 rounded-3">
                    <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                        <Link to="/" className="text-decoration-none text-secondary">
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2 mt-1">{">"}</span>
                    <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
                        Locations
                    </li>
                </ol>
            </nav>

            <div className="my-2">
                {/* 🔎 Search */}
                <div className="row justify-content-end mb-5">
                    <div className="col-lg-5">

                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <Search size={18} className="text-primary" />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Rechercher une location ..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={(e) => {
                                    e.currentTarget.style.outline = "none";
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.borderColor = "#ced4da"; // garde la bordure normale
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.outline = "none";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                                style={{
                                    borderLeft: "0",
                                    outline: "none",
                                    boxShadow: "none",
                                }}
                            />

                        </div>

                    </div>
                </div>

                {/* Ajouter button */}
                <div className="row align-items-center align-content-center">
                    <div className="col-md-6 mt-5 mt-md-0 order-md-first">
                        <Link to={"/formLocation"}>
                            <button
                                className="btn btn-primary px-3 my-3 fw-bold"
                                style={{
                                    visibility: user && user.poste === "operateur de saisie" ? "visible" : "hidden"
                                }}
                            >
                                Ajouter une location
                            </button>
                        </Link>
                    </div>
                </div>


                {/* Status messages */}
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

                {/* Cards section */}
                <div className="row g-4">
                    {status === "success" &&
                        filteredLocations.map((location) => (
                            <div key={location.codeLocation} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px" }}>

                                    {/* 🔹 Header identique */}
                                    <div
                                        className="p-3 text-white"
                                        style={{
                                            background: "linear-gradient(90deg, #007bff, #0056b3)",
                                            borderTopLeftRadius: "15px",
                                            borderTopRightRadius: "15px",
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-2 bg-white bg-opacity-25 rounded-circle">
                                                <FileCheck2 size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-0">{location.codeLocation}</h5>
                                                <div className="d-flex align-items-center gap-1 small">
                                                    <IdCard size={14} />
                                                    <span>{location.cin}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🔸 Body identique, structuré */}
                                    <div className="card-body">

                                        {/* Code terrain */}
                                        <div className="d-flex mb-3">
                                            <div className="p-2 bg-light rounded me-2">
                                                <MapPin size={18} className="text-success" />
                                            </div>
                                            <div>
                                                <small className="text-secondary text-uppercase fw-bold">
                                                    Code terrain
                                                </small>
                                                <p className="mb-0 fw-semibold">{location.codeLand}</p>
                                            </div>
                                        </div>

                                        {/* Usage */}
                                        <div className="d-flex mb-3">
                                            <div className="p-2 bg-light rounded me-2">
                                                <Layers2 size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <small className="text-secondary text-uppercase fw-bold">Usage</small>
                                                <p className="mb-0 fw-semibold">{location.usage}</p>
                                            </div>
                                        </div>

                                        {/* Surface totale */}
                                        <div className="d-flex mb-3">
                                            <div className="p-2 bg-light rounded me-2">
                                                <DollarSign size={18} className="text-danger" />
                                            </div>
                                            <div>
                                                <small className="text-secondary text-uppercase fw-bold">Paiement</small>
                                                <p className="mb-0 fw-semibold">
                                                    {location.methodPayment}
                                                </p>
                                                <small className="text-muted">{location.typePayment}</small>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/location/${location.codeLocation}`}
                                            className="position-absolute bottom-0 end-0 m-lg-3 p-2 rounded-circle bg-light shadow-sm"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Eye size={20} className="text-primary" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {/* Aucun résultat */}
                    {status === "success" && filteredLocations.length === 0 && (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                            <div className="card shadow-sm p-4" style={{ maxWidth: "350px" }}>
                                <Tag size={50} className="text-muted mx-auto mb-3" />
                                <h5 className="fw-bold">Aucune location trouvée</h5>
                                <p className="text-muted">Commencez par ajouter des locations.</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default HomeLocation;
