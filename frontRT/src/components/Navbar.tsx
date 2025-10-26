import { Link } from "react-router-dom";
import { FaBars, FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container-lg">
        <Link to="/" className="text-decoration-none">
          <div className="navbar-brand text-primary fw-bold fst-italic fs-3">
            iwrite
          </div>
        </Link>
        {/* Version desktop */}
        <div className="d-md-block d-none">
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
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;