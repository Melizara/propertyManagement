import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../apps/Store";
import { logout } from "../features/authSlice";
import Swal from "sweetalert2";

function Navbar() {
  const user = useSelector((state: RootState) => state.auth.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez vous déconnecter !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
      reverseButtons: false,
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        window.localStorage.removeItem("token");
        navigate("/");
      }
    });
  };

  const getInitial = (pseudo: string) => pseudo?.charAt(0)?.toUpperCase() || "?";

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
      <div className="container-lg">
        {/* Logo avec gradient */}
        <Link
          to={
            user
              ? user.poste === "operateur de saisie"
                ? "/tenant"
                : user.poste === "admin"
                  ? "/terrain"
                  : user.poste === "caissier"
                    ? "/location"
                    : "/" // pour les autres rôles ou si rôle non défini
              : "/"
          }
          className="navbar-brand text-decoration-none"
        >
          <h2 className="fw-bold mb-0" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>
            <span className="text-dark fst-italic">lan</span>
            <span className="text-primary">D</span>
            <span className="text-dark fst-italic" style={{ fontSize: '1.75rem', fontStyle: 'italic', transform: 'skewX(10deg)', display: 'inline-block' }}>loc</span>
          </h2>
        </Link>


        {/* Burger Menu Mobile */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars className="text-primary fs-4" />
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {user && (
              <>
                {/* Menu Admin */}
                {user.poste === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link to="/terrain" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold position-relative overflow-hidden" style={{ transition: "all 0.3s" }}>
                        Terrain
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/tenant" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Locataire
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/location" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Location
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/gare" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Gare
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/prix" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Prix
                      </Link>
                    </li>
                  </>
                )}

                {/* Menu Caissier */}
                {user.poste === "caissier" && (
                  <li className="nav-item">
                    <Link to="/location" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                      Location
                    </Link>
                  </li>
                )}

                {/* Menu Opérateur */}
                {user.poste === "operateur de saisie" && (
                  <>
                    <li className="nav-item">
                      <Link to="/terrain" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Terrain
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/tenant" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Locataire
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/location" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Location
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/gare" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Gare
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/prix" className="nav-link px-3 py-2 rounded-3 text-dark fw-semibold">
                        Prix
                      </Link>
                    </li>
                  </>
                )}

                {/* Séparateur vertical */}
                <li className="nav-item d-none d-md-block">
                  <div className="vr bg-secondary opacity-25" style={{ height: "30px" }}></div>
                </li>

                {/* Avatar Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      border: "3px solid rgba(13, 110, 253, 0.1)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {getInitial(user.pseudo)}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 py-2" style={{ minWidth: "200px" }}>
                    <li className="px-3 py-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{ width: "35px", height: "35px", fontSize: "0.9rem" }}
                        >
                          {getInitial(user.pseudo)}
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-dark">{user.pseudo}</p>
                          <small className="text-muted">{user.poste}</small>
                        </div>
                      </div>
                    </li>
                    {user && user.poste === "admin" && (
                      <Link
                        to="/activity"
                        className="dropdown-item d-flex align-items-center gap-2 py-2 text-dark fw-semibold"
                      >
                        <FaHistory /> Historique
                      </Link>
                    )}
                    <li>
                      <button
                        className="dropdown-item py-2 text-danger fw-semibold d-flex align-items-center gap-2 mt-1"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {/* Boutons Non Connecté */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link to="/login">
                    <button className="btn btn-outline-primary fw-semibold px-4 py-2 rounded-pill d-flex align-items-center gap-2">
                      <FaSignInAlt /> Connexion
                    </button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">
                    <button className="btn btn-primary fw-semibold px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                      <FaUserPlus /> Inscription
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .nav-link {
          position: relative;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0d6efd, #0a58ca);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 80%;
        }
        
        .nav-link:hover {
          color: #0d6efd !important;
          background-color: rgba(13, 110, 253, 0.05);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3) !important;
        }

        .btn-outline-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
        }

        .dropdown-menu {
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item:hover {
          background-color: rgba(13, 110, 253, 0.08);
          padding-left: 1.5rem;
          transition: all 0.2s ease;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;