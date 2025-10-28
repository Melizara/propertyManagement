import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice.tsx";
import type { AppDispatch } from "../../apps/Store.tsx";

function Login() {
  const [inputs, setInputs] = useState({
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await dispatch(login(inputs));

      if (data.payload && "token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
      }
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  return (
    <div className="contsiner-lg my-5">
      <div className="text-center align-items-center align-content-center">
        <div className="d-flex justify-content-center">
          <form className="border p-5" onSubmit={handleSubmit}>
            <h4 className="text-secondary fw-bold fs-3 mb-5">Login</h4>
            <div className="mb-3">
              <input type="email" placeholder="Email" className="form-control" name="email"
                value={inputs.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input type="password" placeholder="password" className="form-control" name="password"
                value={inputs.password}
                onChange={handleChange}
                required />
            </div>
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