import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/authSlice.tsx";
import type { AppDispatch } from "../../apps/Store.tsx";
import type { RootState } from "../../apps/Store.tsx";
import { clearError } from "../../features/authSlice.tsx";

function Register() {
  const user = useSelector((state: RootState) => state.auth.data);
  const error = useSelector((state: RootState) => state.auth.error);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // pour afficher l'erreur


  const [inputs, setInputs] = useState({
    matricule: "",
    pseudo: "",
    email: "",
    poste: "",
    password: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset error quand le composant Login est monté
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputs.password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    } else {
      setPasswordError("");
    }
    try {
      const data = await dispatch(register(inputs));

      if (data.payload && "token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
        navigate("/login");
      }

    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (user && window.localStorage.getItem("token")) {
    return <Navigate to="/locataire" />
  }


  return (
    <div className="container-lg my-5">
      <div className="text-center align-items-center align-content-center">
        <div className="d-flex justify-content-center">
          <form className="border p-5" onSubmit={handleSubmit}>
            <h4 className="text-secondary fw-bold fs-3 mb-5">Register</h4>
            <div className="mb-3">
              <input type="text" placeholder="matricule" className="form-control" name="matricule"
                value={inputs.matricule}
                onChange={handleChange}
                required />
              {error && Array.isArray(error) && error.some(err => err.path === "matricule") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "matricule").msg}
                </div>
              )}
            </div>
            <div className="mb-3">
              <input type="text" placeholder="pseudo" className="form-control" name="pseudo"
                value={inputs.pseudo}
                onChange={handleChange}
                required />
              {error && Array.isArray(error) && error.some(err => err.path === "pseudo") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "pseudo").msg}
                </div>
              )}
            </div>
            <div className="mb-3">
              <input type="email" placeholder="Email" className="form-control" name="email"
                value={inputs.email}
                onChange={handleChange}
                required />
              {error && Array.isArray(error) && error.some(err => err.path === "email") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "email").msg}
                </div>
              )}
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                name="poste"
                value={inputs.poste}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>Poste</option>
                <option value="admin">Admin</option>
                <option value="operateur de saisie">Opérateur de saisie</option>
                <option value="caissier">Caissier</option>
              </select>
              {error && Array.isArray(error) && error.some(err => err.path === "poste") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "poste")?.msg}
                </div>
              )}
            </div>
            <div className="mb-3">
              <input type="password" placeholder="password" className="form-control" name="password"
                value={inputs.password}
                onChange={handleChange}
                required />
              {error && Array.isArray(error) && error.some(err => err.path === "password") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "password").msg}
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && (
                <div className="alert alert-danger">
                  {passwordError}
                </div>
              )}
            </div>


            {error && typeof error === "string" && error === "Utilisateur deja existant" && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            <div className="mb-4">
              <p>
                Already have an account?
                <Link to={"/login"}>Sign In</Link>
              </p>
            </div>
            <button type="submit" className="btn btn-primary">SignUp</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;