import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaHome, FaSignInAlt, FaUserPlus, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../apps/Store";
import { logout } from "../features/authSlice";

function Navbar() {
  const user = useSelector((state: RootState) => state.auth.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vous déconnecter ?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
      navigate("/");
    }
  };
  const getInitial = (pseudo: string) => pseudo?.charAt(0)?.toUpperCase() || "?";

  return (
    <nav
      className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top border-bottom"
      style={{ padding: "0.7rem 0" }}
    >
      <div className="container-lg d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link to={user ? "/locataire" : "/"} className="navbar-brand text-decoration-none">
          <h2 className="fw-bold text-primary fst-italic mb-0">
            i<span className="text-dark">write</span>
          </h2>
        </Link>

        {/* Desktop Links */}
        <div className="d-none d-md-flex align-items-center gap-4">
          {user && (
            <>
              <Link
                to="/locataire"
                className="text-secondary text-decoration-none fw-semibold"
              >
                Locataire
              </Link>
              {/* <Link
                to="/story"
                className="text-secondary text-decoration-none fw-semibold"
              >
                Story
              </Link> */}
              <Link
                to="/terrain"
                className="text-secondary text-decoration-none fw-semibold"
              >
                Terrain
              </Link>
              <Link
                to="/gare"
                className="text-secondary text-decoration-none fw-semibold"
              >
                Gare
              </Link>
              <Link
                to="/prix"
                className="text-secondary text-decoration-none fw-semibold"
              >
                Prix
              </Link>
              <Link
                to="/location"
                className="text-secondary text-decoration-none fw-semibold"
              >
                Location
              </Link>
            </>
          )}

          {user ? (
            // Cercle avatar + dropdown
            <div className="dropdown">
              <button
                className="btn btn-light border-0 p-0 rounded-circle position-relative"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  width: "45px",
                  height: "45px",
                  backgroundColor: "#0d6efd",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {getInitial(user.pseudo)}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end mt-2 shadow-sm"
                aria-labelledby="userDropdown"
              >
                <li>
                  <button
                    className="dropdown-item fw-semibold text-danger d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" /> Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login">
                <button className="btn btn-primary fw-semibold d-flex align-items-center">
                  <FaSignInAlt className="me-2" /> Connexion
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-outline-primary fw-semibold d-flex align-items-center">
                  <FaUserPlus className="me-2" /> Inscription
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="d-md-none">
          <div className="dropdown">
            <button
              className="btn btn-primary rounded-circle p-2"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaBars />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end shadow-sm mt-2"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <Link to="/locataire" className="dropdown-item fw-semibold text-secondary">
                  <FaHome className="me-2" /> Accueil
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <span className="dropdown-item fw-semibold text-primary">
                      <FaUserAlt className="me-2" /> {user.pseudo}
                    </span>
                  </li>
                  <li onClick={handleLogout}>
                    <span className="dropdown-item fw-semibold text-danger">
                      <FaSignOutAlt className="me-2" /> Déconnexion
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="dropdown-item fw-semibold text-secondary"
                    >
                      <FaSignInAlt className="me-2" /> Connexion
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="dropdown-item fw-semibold text-secondary"
                    >
                      <FaUserPlus className="me-2" /> Inscription
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
