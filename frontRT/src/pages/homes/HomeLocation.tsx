import { Link } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../apps/Store";
// import type { AppDispatch } from "../../apps/Store";
// import { fetchLocations } from "../../features/locationSlice";

function HomeLocation() {
    //   const { locations, status } = useSelector((state: RootState) => state.locations);
    //   const dispatch = useDispatch<AppDispatch>();

    //   useEffect(() => {
    //     dispatch(fetchLocations())
    //   }, [dispatch]);

    return (
        <div className="container-lg my-5">
            <div className="row align-items-center align-content-center">
                <div className="col-md-6 mt-5 mt-md-0 order-md-first">
                    <div>
                        <h1 className="text-primary text-uppercase fs-1 fw-bold">
                            Location
                        </h1>
                        <Link to={"/formLocation"}>
                            <button className="btn btn-primary px-3 my-3 fw-bold">
                                Ajouter une location
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="my-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center">
                            <h2 className="fw-bold mb-5">Derniers locations</h2>
                        </div>
                    </div>
                </div>

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
                    {/* {status === "success" && locations.map((location) => (
                        <div key={location.cin} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header text-white bg-primary text-center">
                                    <h5 className="fw-bold mb-0">{location.name} {location.lastName}</h5>
                                </div>
                                <div className="card-body text-start">
                                    <p><strong>code location :</strong> {location.codeLocation}</p>
                                    <p><strong>code terrain :</strong> {location.codeLand}</p>
                                    <p><strong>Cin du locataire :</strong> {location.cin}</p>
                                    <p><strong>Usage :</strong> {location.usage}</p>
                                    <p><strong>Mère :</strong> {location.mother}</p>
                                    <p><strong>Adresse :</strong> {location.address}, {location.neighborHood}, {location.municipality}</p>
                                </div>
                                <div className="card-footer text-center bg-white">
                                    <Link to={`/location/${location.cin}`}>
                                        <button className="btn btn-primary w-75 fw-bold">Voir</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>

    )
}

export default HomeLocation;