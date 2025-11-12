import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/authSlice.tsx";
import type { AppDispatch } from "../../apps/Store.tsx";
import type { RootState } from "../../apps/Store.tsx";
import { clearError } from "../../features/authSlice.tsx";

function Login() {
  const user = useSelector((state: RootState) => state.auth.data);
  const error = useSelector((state: RootState) => state.auth.error);

  const [inputs, setInputs] = useState({
    matricule: "",
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
      const data = await dispatch(login(inputs));

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
            <h4 className="text-secondary fw-bold fs-3 mb-5">Login</h4>
            <div className="mb-3">
              <input type="text" placeholder="Matricule" className="form-control" name="matricule"
                value={inputs.matricule}
                onChange={handleChange}
                required
              />
              {error && Array.isArray(error) && error.some(err => err.path === "matricule") && (
                <div className="alert alert-danger">
                  {error.find(err => err.path === "matricule").msg}
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
            {error && typeof error === "string" && (
              <div className="alert alert-danger">
                {error === "Password is wrong" && "Password is incorrect.PLease check your password"}
                {error === "User is not found" && "Please check your email and password"}
              </div>
            )}
            <div className="mb-4">
              <p>
                Not a member?
                <Link to={"/register"}>Sign up</Link>
              </p>
            </div>
            <button type="submit" className="btn btn-primary">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;