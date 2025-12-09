// Import des composants et hooks nécessaires depuis react-router-dom, React et Redux
import { Link, useNavigate, Navigate } from "react-router-dom"; // pour la navigation et les liens
import { useState, useEffect } from "react"; // useState pour gérer les états, useEffect pour les effets secondaires
import type { ChangeEvent, FormEvent } from "react"; // types TypeScript pour les événements de formulaire
import { useDispatch, useSelector } from "react-redux"; // pour dispatcher des actions et accéder au store Redux
import { login, clearError } from "../../features/authSlice.tsx"; // actions pour login et effacer les erreurs
import type { AppDispatch, RootState } from "../../apps/Store.tsx"; // types pour Redux
import { User, Lock } from "lucide-react"; // icônes pour les inputs
import { Eye, EyeOff } from "lucide-react";


function Login() {
  // Récupère l'utilisateur actuel depuis le store Redux
  const user = useSelector((state: RootState) => state.auth.data);

  // État local pour stocker les inputs du formulaire
  const [inputs, setInputs] = useState({ matricule: "", password: "" });

  const [showPassword, setShowPassword] = useState(false);


  // Récupère l'erreur liée au champ "matricule" depuis Redux
  const matriculeError = useSelector(
    (state: RootState) =>
      state.auth.error?.field === "matricule" ? state.auth.error.message : null
  );

  // Récupère l'erreur liée au champ "password" depuis Redux
  const passwordError = useSelector(
    (state: RootState) =>
      state.auth.error?.field === "password" ? state.auth.error.message : null
  );

  // Fonction pour mettre à jour l'état des inputs lorsque l'utilisateur tape
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // récupère le nom et la valeur de l'input
    setInputs((prev) => ({ ...prev, [name]: value })); // met à jour le bon champ
  };

  const dispatch = useDispatch<AppDispatch>(); // pour envoyer des actions Redux
  const navigate = useNavigate(); // pour naviguer entre les pages

  // Effet qui efface les erreurs lorsque le composant se monte
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Fonction qui gère la soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // empêche le rechargement de la page
    try {
      const data = await dispatch(login(inputs)); // envoie les données de login à Redux
      if (data.payload && "token" in data.payload) {
        localStorage.setItem("token", data.payload.token); // stocke le token dans le localStorage
        // redirige selon le rôle de l'utilisateur
        if (data.payload.poste === "admin") navigate("/terrain");
        else if (data.payload.poste === "caissier") navigate("/location");
        else if (data.payload.poste === "operateur de saisie") navigate("/tenant");
      }
    } catch (err) {
      console.error("Login failed:", err); // affiche une erreur en console si le login échoue
    }
  };

  // Si l'utilisateur est déjà connecté et qu'un token existe, on le redirige selon son rôle
  if (user && localStorage.getItem("token")) {
    if (user.poste === "admin") return <Navigate to="/terrain" />;
    if (user.poste === "caissier") return <Navigate to="/location" />;
    if (user.poste === "operateur de saisie") return <Navigate to="/terrain" />;
  }

  // Retourne le formulaire de login
  return (
    <div className="d-flex justify-content-center align-items-center">
      <form
        className="p-5 rounded-4 shadow-lg bg-white position-relative"
        style={{ width: "380px", transition: "all 0.3s" }}
        onSubmit={handleSubmit} // relie la soumission à handleSubmit
      >
        <h3 className="text-center mb-2 fw-bold" style={{ color: "#026da1" }}>
          Connectez-vous
        </h3>
        <p className="text-center small mb-2">
          Veuillez entrer vos identifiants pour continuer.
        </p>

        {/* Champ Matricule */}
        <div className="mb-3 position-relative">
          {/* Affiche l'erreur de matricule si elle existe */}
          <div
            className="text-danger small mb-1"
            style={{ minHeight: "24px", lineHeight: "1.2" }}
          >
            {matriculeError && matriculeError}
          </div>
          {/* Icône utilisateur */}
          <User
            className="position-absolute"
            style={{
              top: "70%",
              left: "15px",
              transform: "translateY(-50%)",
              color: "#026da1",
            }}
            size={22}
          />
          {/* Input matricule */}
          <input
            type="text"
            name="matricule"
            placeholder="Matricule"
            maxLength={5}
            value={inputs.matricule}
            onChange={handleChange} // met à jour l'état quand l'utilisateur tape
            required
            className="form-control rounded-pill ps-5 py-2 shadow-sm"
            style={{
              borderColor: "#026da1",
              transition: "all 0.3s",
            }}
          />
        </div>

        {/* Champ Password */}
        <div className="mb-4 position-relative">
          {/* Affiche l'erreur de password si elle existe */}
          <div
            className="text-danger small mb-1"
            style={{ minHeight: "24px", lineHeight: "1.2" }}
          >
            {passwordError && passwordError}
          </div>
          {/* Icône cadenas */}
          <Lock
            className="position-absolute"
            style={{
              top: "70%",
              left: "15px",
              transform: "translateY(-50%)",
              color: "#026da1",
            }}
            size={22}
          />
          {/* Input password */}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            maxLength={8}
            value={inputs.password}
            onChange={handleChange}
            required
            className="form-control rounded-pill ps-5 py-2 shadow-sm"
            style={{
              borderColor: "#026da1",
              transition: "all 0.3s",
            }}
          />

          {/* Bouton œil */}
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="position-absolute"
            style={{
              top: "70%",
              right: "15px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#026da1",
            }}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </div>

        </div>

        {/* Lien vers la page d'inscription */}
        <div className="text-center mb-4">
          <p className="small">
            Pas encore membre ? <Link to="/register">Inscrivez-vous ici</Link>
          </p>
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          className="btn w-100 py-2 fw-bold"
          style={{
            background: "linear-gradient(135deg, #026da1, #4b3f72)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            transition: "all 0.3s",
          }}
          // Effet au survol du bouton
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

// Exporte le composant Login pour pouvoir l'utiliser dans d'autres fichiers
export default Login;
