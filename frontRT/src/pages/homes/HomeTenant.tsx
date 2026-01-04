import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../apps/Store";
import type { AppDispatch } from "../../apps/Store";
import { fetchTenants } from "../../features/tenantSlice";
import { useState } from "react";
import { User, MapPin, Calendar, Eye, IdCard, Search, PlusCircle } from "lucide-react";

function HomeTenant() {
  const { tenants, status } = useSelector((state: RootState) => state.tenants);
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const user = useSelector((state: RootState) => state.auth.data);

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
    <div className="container-lg" style={{ marginTop: "-99px" }}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb py-2 px-3 rounded-3">
          <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
            <Link to="/" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
              Accueil
            </Link>
          </li>
          <span className="mx-2 mt-1">{" > "}</span>
          <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
            Locataires
          </li>
        </ol>
      </nav>
      <div className="my-2">  {/* au lieu de my-5 */}
        <div className="row justify-content-end mb-5">
          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Rechercher un locataire ..."
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
        <div className="row align-items-center align-content-center">
          <div className="col-md-6 mt-5 mt-md-0 order-md-first">
            <div>
              <Link to={"/formTenant"} style={{textDecoration:"none"}}>
                <button
                  className="btn btn-success px-3 my-3 fw-bold d-flex align-items-center gap-2"
                  style={{
                    visibility: user && user.poste === "operateur de saisie" ? "visible" : "hidden"
                  }}
                >
                  <PlusCircle size={18} />
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

        <div className="row g-4">
          {status === "success" &&
            filteredTenants.map((tenant) => (
              <div key={tenant.cin} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px" }}>

                  {/* Header */}
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
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0 fs-6">
                          {tenant.name} {tenant.lastName}
                        </h5>
                        <div className="d-flex align-items-center gap-1 small">
                          <IdCard size={14} />
                          <span>{tenant.cin}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="card-body">
                    {/* Date de naissance */}
                    <div className="d-flex mb-1">
                      <div className="p-2 bg-light rounded me-2">
                        <Calendar size={18} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-secondary text-uppercase fw-bold">Date de naissance</small>
                        <p className="mb-0 fw-semibold">
                          {new Date(tenant.birthDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <small className="text-muted">{tenant.birthPlace}</small>
                      </div>
                    </div>

                    {/* Adresse */}
                    <div className="d-flex mb-3">
                      <div className="p-2 bg-light rounded me-2">
                        <MapPin size={18} className="text-success" />
                      </div>
                      <div>
                        <small className="text-secondary text-uppercase fw-bold">Adresse</small>
                        <p className="mb-0 fw-semibold">{tenant.address}</p>
                        <small className="text-muted">
                          {tenant.neighborHood}, {tenant.municipality}
                        </small>
                      </div>
                    </div>

                    {/* Button */}
                    <Link
                      to={`/tenant/${tenant.cin}`}
                      className="position-absolute bottom-0 end-0 mb- m-lg-3 p-2 rounded-circle bg-light shadow-sm"
                      style={{ cursor: "pointer" }}
                    >
                      <Eye size={20} className="text-primary" />
                    </Link>

                  </div>
                </div>
              </div>
            ))}
        </div>

        {status === "success" && filteredTenants.length === 0 && (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <div className="card shadow-sm p-4 mt-5" style={{ maxWidth: "350px" }}>
              <User size={50} className="text-muted mx-auto mb-3" />
              <h5 className="fw-bold">Aucun locataire trouvé</h5>
              <p className="text-muted">Commencez par ajouter des locataires à votre liste</p>
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

export default HomeTenant;