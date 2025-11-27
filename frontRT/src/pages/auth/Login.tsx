import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../features/authSlice.tsx";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import { User, Lock } from "lucide-react";

function Login() {
  const user = useSelector((state: RootState) => state.auth.data);
  const error = useSelector((state: RootState) => state.auth.error);

  const [inputs, setInputs] = useState({ matricule: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await dispatch(login(inputs));
      if (data.payload && "token" in data.payload) {
        localStorage.setItem("token", data.payload.token);
        if (data.payload.poste === "admin") navigate("/terrain");
        else if (data.payload.poste === "caissier") navigate("/location");
        else if (data.payload.poste === "operateur de saisie") navigate("/locataire");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  if (user && localStorage.getItem("token")) {
    if (user.poste === "admin") return <Navigate to="/terrain" />;
    if (user.poste === "caissier") return <Navigate to="/location" />;
    if (user.poste === "operateur de saisie") return <Navigate to="/terrain" />;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
    >
      <form
        className="p-5 rounded-4 shadow-lg bg-white position-relative"
        style={{ width: "380px", transition: "all 0.3s" }}
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#026da1" }}>
          Welcome Back
        </h3>

        {/* Matricule */}
        <div className="mb-4 position-relative">
          <User
            className="position-absolute"
            style={{
              top: "50%",
              left: "15px",
              transform: "translateY(-50%)",
              color: "#026da1",
            }}
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
            style={{
              borderColor: "#026da1",
              transition: "all 0.3s",
            }}
          />
          {error &&
            Array.isArray(error) &&
            error.some((err) => err.path === "matricule") && (
              <div className="text-danger mt-1 small">
                {error.find((err) => err.path === "matricule").msg}
              </div>
            )}
        </div>

        {/* Password */}
        <div className="mb-4 position-relative">
          <Lock
            className="position-absolute"
            style={{
              top: "50%",
              left: "15px",
              transform: "translateY(-50%)",
              color: "#026da1",
            }}
            size={22}
          />
          <input
            type="password"
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
          {error &&
            Array.isArray(error) &&
            error.some((err) => err.path === "password") && (
              <div className="text-danger mt-1 small">
                {error.find((err) => err.path === "password").msg}
              </div>
            )}
        </div>

        {error && typeof error === "string" && (
          <div className="alert alert-danger text-center">
            {error === "Password is wrong"
              ? "Password incorrect. Please check your password"
              : "User not found. Check your credentials"}
          </div>
        )}

        <div className="text-center mb-4">
          <p className="small">
            Not a member? <Link to="/register">Sign up</Link>
          </p>
        </div>

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

export default Login;
