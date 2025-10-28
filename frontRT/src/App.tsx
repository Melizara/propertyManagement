import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Story from "./pages/Story";
import Write from "./pages/forms/Write";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./apps/Store.tsx";
import axios from "./axios"
import { account } from "./features/authSlice";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/story/:id",
        element: <Story />
      },
      {
        path: "/write",
        element: <Write />
      }
    ]
  }
]);

function App() {
  const dispatch= useDispatch<AppDispatch>();

  useEffect(()=>{
    const token = localStorage.getItem("token");

    if(token){
      axios.defaults.headers.common["Authorization"]=`Bearer ${token}`
      dispatch(account());
    }
  },[dispatch])
  return <RouterProvider router={router} />
}

export default App;