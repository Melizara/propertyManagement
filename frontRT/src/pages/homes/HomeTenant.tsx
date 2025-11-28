import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../apps/Store";
import type { AppDispatch } from "../../apps/Store";
import { fetchTenants } from "../../features/tenantSlice";
import { useState } from "react";

function HomeTenant() {
  const { tenants, status } = useSelector((state: RootState) => state.tenants);
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    dispatch(fetchTenants())
  }, [dispatch]);

 const filteredTenants = tenants.filter((tenant) => {
  const allData = `
    ${tenant.name}
    ${tenant.lastName}
    ${tenant.cin}
    ${tenant.birthDate}
    ${tenant.birthPlace}
    ${tenant.father}
    ${tenant.mother}
    ${tenant.address}
    ${tenant.neighborHood}
    ${tenant.municipality}
  `.toLowerCase();

  return allData.includes(search.toLowerCase());
});


  return (
    <div className="container-lg" style={{ marginTop: "-280px" }}>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "5px" }}>
          <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Locataires</li>
        </ol>
      </nav>
      <div className="my-2">  {/* au lieu de my-5 */}
        <div className="row justify-content-end mb-2">
          <div className="col-lg-8">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un locataire par nom, prénom ou CIN"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="row align-items-center align-content-center">
        <div className="col-md-6 mt-5 mt-md-0 order-md-first">
          <div>
            <Link to={"/formTenant"}>
              <button className="btn btn-primary px-3 my-3 fw-bold">
                Ajouter un locataire
              </button>
            </Link>
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
          {status === "success" && filteredTenants.map((tenant) => (
            <div key={tenant.cin} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header text-white bg-primary text-center">
                  <h5 className="fw-bold mb-0">{tenant.name} {tenant.lastName}</h5>
                </div>
                <div className="card-body text-start">
                  <p><strong>CIN :</strong> {tenant.cin}</p>
                  <p><strong>Date de naissance :</strong> {new Date(tenant.birthDate).toLocaleDateString()}</p>
                  <p><strong>Lieu de naissance :</strong> {tenant.birthPlace}</p>
                  <p><strong>Père :</strong> {tenant.father}</p>
                  <p><strong>Mère :</strong> {tenant.mother}</p>
                  <p><strong>Adresse :</strong> {tenant.address}, {tenant.neighborHood}, {tenant.municipality}</p>
                </div>
                <div className="card-footer text-center bg-white">
                  <Link to={`/tenant/${tenant.cin}`}>
                    <button className="btn btn-primary w-75 fw-bold">Voir</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  )
}

export default HomeTenant;