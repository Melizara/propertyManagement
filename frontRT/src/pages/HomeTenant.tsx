import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../apps/Store";
import type { AppDispatch } from "../apps/Store";
import { fetchTenants } from "../features/tenantSlice";


function HomeTenant() {
  const { tenants, status } = useSelector((state: RootState) => state.tenants);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTenants())
  }, [dispatch]);

  return (
    <div className="container-lg my-5">
      <div className="row align-items-center align-content-center">
        <div className="col-md-6 mt-5 mt-md-0">
          <div className="text-center">
            Texte au centre
          </div>
        </div>
        <div className="col-md-6 mt-5 mt-md-0 order-md-first">
          <div>
            <h1 className="text-primary text-uppercase fs-1 fw-bold">
              pussy
            </h1>
            <p className="mt-4 text-muted">
              Locataire de terrain
            </p>
            <Link to={"/formTenant"}><button className="btn btn-primary px-3 my-3 fw-bold">Write man</button></Link>
          </div>
        </div>
      </div>
      <div className="my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              <h2 className="fw-bold mb-5">Latest</h2>
            </div>
          </div>
        </div>

        {status === "loading" && (
          <div className="text-center mt-5">
            <h3 className="text-secondary fw-bold fs-4">
              Loading ...
            </h3>
          </div>
        )}
        {status === "error" && (
          <div className="text-center mt-5">
            <h3 className="text-secondary fw-bold fs-4">
              Wrong
            </h3>
          </div>
        )}
        <div className="row">
          {status === "success" && tenants.map((tenant) => (
            <div key={tenant.cin} className="col-md-6 col-lg-4 text-center text-decoration-none">
              <div className="shadow rounded">
                rounded
              </div>
              <h2 className="lead fw-bold my-4">{tenant.name}</h2>
              <Link to={`/story/${tenant.lastName}`}><button className="btn btn-primary text-white lead fw-bold mb-5">Read</button></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeTenant;