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
    if (window.confirm("deconnecter?")) {
      dispatch(logout());
      window.localStorage.removeItem("token")
      navigate("/")
    }
  }

  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container-lg">
        <Link to="/" className="text-decoration-none">
          <div className="navbar-brand text-primary fw-bold fst-italic fs-3">
            iwrite
          </div>
        </Link>
        <Link to="/locataire" className="text-decoration-none">
          <div className="navbar-brand text-primary fw-bold fst-italic fs-3">
            Locataire
          </div>
        </Link>
        {/* Version desktop */}
        <div className="d-md-block d-none">
          {user ?
            <div className="d-flex align-items-center justify-content-center">
              <div className="text-primary text-decoration-none d-flex align-text-center align-content-center">
                <FaUserAlt className="me-2 mt-2 fs-5" />
                <h4 className="mt-2 me-5 fs-5 lead fw-bold">{user.pseudo}</h4>
              </div>
              <div className="px-4 rounded-pill">
                <button className="btn btn-primary text-white lead fw-bold" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />Sign Out
                </button>
              </div>
            </div>
            :
            <div className="d-flex gap-3 align-items-center">
              <Link to="/login">
                <button className="btn btn-primary text-white fw-bold">
                  <FaSignInAlt className="me-2" />
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary text-white fw-bold">
                  <FaUserPlus className="me-2" />
                  Register
                </button>
              </Link>
            </div>
          }
        </div>

        {/* Version mobile */}
        <div className="d-block d-md-none">
          <div className="dropdown">
            <button
              className="btn btn-primary px-3"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaBars className="mb-1" />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <Link to="/" className="dropdown-item text-secondary fw-bold fs-6">
                  <FaHome className="me-2" />
                  Home
                </Link>
              </li>
              {
                user ?
                  <>
                    <div className="text-primary text-decoration-none">
                      <li className="dropdown-item text-secondary fw-bold fs-6">
                        <FaUserAlt className="me-2" />{user.pseudo}
                      </li>
                    </div>
                    <li className="dropdown-item text-secondary fw-bold fs-6" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Sign Out
                    </li>
                  </>
                  :
                  <>
                    <li>
                      <Link to="/login" className="dropdown-item text-secondary fw-bold fs-6">
                        <FaSignInAlt className="me-2" />
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="dropdown-item text-secondary fw-bold fs-6">
                        <FaUserPlus className="me-2" />
                        Register
                      </Link>
                    </li>
                  </>
              }

            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;