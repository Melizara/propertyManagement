import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../apps/Store";
import type { AppDispatch } from "../../apps/Store";
import { fetchTenants } from "../../features/tenantSlice";

function HomeTenant() {
  const { tenants, status } = useSelector((state: RootState) => state.tenants);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTenants())
  }, [dispatch]);

  return (
    <div className="container-lg my-5">
      <div className="row align-items-center align-content-center">
        <div className="col-md-6 mt-5 mt-md-0 order-md-first">
          <div>
            <h1 className="text-primary text-uppercase fs-1 fw-bold">
              Locataire
            </h1>
            <Link to={"/formTenant"}>
              <button className="btn btn-primary px-3 my-3 fw-bold">
                Ajouter un locataire
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              <h2 className="fw-bold mb-5">Derniers locataires</h2>
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
          {status === "success" && tenants.map((tenant) => (
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