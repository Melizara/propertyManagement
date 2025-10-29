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

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    try {
      const data = await dispatch(register(inputs));

      if (data.payload && "token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
        navigate("/");
      }

    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (user && window.localStorage.getItem("token")) {
    return <Navigate to="/" />
  }


  return (
    <div className="container-lg my-5">
      <div className="text-center align-items-center align-content-center">
        <div className="d-flex justify-content-center">
          <form className="border p-5" onSubmit={handleSubmit}>
            <h4 className="text-secondary fw-bold fs-3 mb-5">Register</h4>
            <div className="mb-3">
              <input type="text" placeholder="username" className="form-control" name="username"
                value={inputs.username}
                onChange={handleChange}
                required />
              {error && Array.isArray(error) && error.some(err => err.path === "username") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "username").msg}
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