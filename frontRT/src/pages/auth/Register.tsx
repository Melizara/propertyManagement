import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../../features/authSlice.tsx";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import { User, Mail, Lock, Briefcase } from "lucide-react";

function Register() {
  const user = useSelector((state: RootState) => state.auth.data);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [matriculeError, setMatriculeError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [inputs, setInputs] = useState({
    matricule: "",
    pseudo: "",
    email: "",
    poste: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputs.password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    } else setPasswordError("");

    try {
      const resultAction = await dispatch(register(inputs));
      if (register.fulfilled.match(resultAction)) {
        window.localStorage.setItem("token", resultAction.payload.token);
        navigate("/login");
      } else if (register.rejected.match(resultAction)) {
        const errors = resultAction.payload as { email?: string; matricule?: string; general?: string };
        if (errors.email) setEmailError(errors.email);
        if (errors.matricule) setMatriculeError(errors.matricule);
        if (errors.general) setGeneralError(errors.general);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (user && window.localStorage.getItem("token")) {
    return <Navigate to="/terrain" />;
  }

  const errorStyleFixed = {
    height: "20px", // hauteur fixe
    overflow: "hidden", // empêche le contenu de dépasser
    color: "red",
    fontSize: "0.8rem",
    marginTop: "4px",
  };


  return (
    <div className="d-flex justify-content-center align-items-center my-5">
      <form
        className="p-4 p-md-5 rounded-4 shadow-lg bg-white w-100"
        style={{ maxWidth: "700px", transition: "all 0.3s" }}
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-2 fw-bold" style={{ color: "#026da1" }}>
          Créez votre compte
        </h3>
        <p className="text-center small mb-5">
          Remplissez le formulaire ci-dessous pour commencer.
        </p>

        <div className="row g-3">
          {/* Matricule */}
          <div className="col-12 col-md-6 position-relative">
            <User
              className="position-absolute"
              style={{ top: "30%", left: "15px", transform: "translateY(-50%)", color: "#026da1" }}
              size={22}
            />
            <input
              type="text"
              name="matricule"
              placeholder="Matricule"
              maxLength={5}
              value={inputs.matricule}
              onChange={handleChange}
              required
              className="form-control rounded-pill ps-5 py-2 shadow-sm"
              style={{ borderColor: "#026da1", transition: "all 0.3s" }}
            />
            <div style={errorStyleFixed}>
              {matriculeError && <span>{matriculeError}</span>}
            </div>
          </div>

          {/* Pseudo */}
          <div className="col-12 col-md-6 position-relative">
            <User
              className="position-absolute"
              style={{ top: "30%", left: "15px", transform: "translateY(-50%)", color: "#026da1" }}
              size={22}
            />
            <input
              type="text"
              name="pseudo"
              placeholder="Pseudo"
              maxLength={70}
              value={inputs.pseudo}
              onChange={handleChange}
              required
              className="form-control rounded-pill ps-5 py-2 shadow-sm"
              style={{ borderColor: "#026da1", transition: "all 0.3s" }}
            />
            <div style={{ minHeight: "20px" }}></div>
          </div>

          {/* Email */}
          <div className="col-12 col-md-6 position-relative">
            <Mail
              className="position-absolute"
              style={{ top: "30%", left: "15px", transform: "translateY(-50%)", color: "#026da1" }}
              size={22}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              maxLength={50}
              value={inputs.email}
              onChange={handleChange}
              required
              className="form-control rounded-pill ps-5 py-2 shadow-sm"
              style={{ borderColor: "#026da1", transition: "all 0.3s" }}
            />
            <div style={errorStyleFixed}>
              {emailError && <span>{emailError}</span>}
            </div>
          </div>

          {/* Poste */}
          <div className="col-12 col-md-6 position-relative">
            <Briefcase
              className="position-absolute"
              style={{ top: "30%", left: "15px", transform: "translateY(-50%)", color: "#026da1" }}
              size={22}
            />
            <select
              className="form-select rounded-pill ps-5 py-2 shadow-sm"
              name="poste"
              value={inputs.poste}
              onChange={handleChange}
              required
              style={{ borderColor: "#026da1", transition: "all 0.3s" }}
            >
              <option value="" disabled hidden>Poste</option>
              <option value="admin">Admin</option>
              <option value="operateur de saisie">Opérateur de saisie</option>
              <option value="caissier">Caissier</option>
            </select>
            <div style={{ minHeight: "20px" }}></div>
          </div>

          {/* Password */}
          <div className="col-12 col-md-6 position-relative">
            <Lock
              className="position-absolute"
              style={{ top: "30%", left: "15px", transform: "translateY(-50%)", color: "#026da1" }}
              size={22}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              maxLength={8}
              minLength={8}
              value={inputs.password}
              onChange={handleChange}
              required
              className="form-control rounded-pill ps-5 py-2 shadow-sm"
              style={{ borderColor: "#026da1", transition: "all 0.3s" }}
            />
            <div style={{ minHeight: "20px" }}></div>
          </div>

          {/* Confirm Password */}
          <div className="col-12 col-md-6 position-relative">
            <Lock
              className="position-absolute"
              style={{ top: "30%", left: "15px", transform: "translateY(-50%)", color: "#026da1" }}
              size={22}
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              maxLength={8}
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control rounded-pill ps-5 py-2 shadow-sm"
              style={{ borderColor: "#026da1", transition: "all 0.3s" }}
            />
            <div style={errorStyleFixed}>
              {passwordError && <span>{passwordError}</span>}
            </div>

          </div>
        </div>
        {/* Erreur générale */}
        <div style={errorStyleFixed}>
          {generalError && <span>{generalError}</span>}
        </div>

        <div className="text-center mt-1 mb-1">
          <p className="small">
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
          </p>
        </div>
        {/* Bouton Submit */}
        <button
          type="submit"
          className="btn w-100 py-2 fw-bold mt-1"
          style={{
            background: "linear-gradient(135deg, #026da1, #4b3f72)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
