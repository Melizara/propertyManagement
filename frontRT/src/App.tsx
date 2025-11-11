//Outlet est une zone ou le contenu des pages enfants s'affichent
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Story from "./pages/Story";
import Write from "./pages/forms/Write";
import { useEffect } from "react";
//useDispatch permet d'envoyer une action Redux
import { useDispatch } from "react-redux";
//AppDispatch sert a typer le dispatch avec typescript
import type { AppDispatch } from "./apps/Store.tsx";
//Tsy mila manoratra anle localhost:5000 iny tsony fa efa ato zay
import axios from "./axios"
//Action Redux pour recuperer les informations de l'user connectee
import { account } from "./features/authSlice";
import Tenant from "./pages/Tenant.tsx";
import TenantForm from "./pages/forms/TenantForm.tsx";
import HomeTenant from "./pages/HomeTenant.tsx";

//Layout est un modele de page commun,Outlet change selon la route
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

//Creation de toute les routes
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/locataire",
        element: <HomeTenant />
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
        path: "/tenant/:id",
        element: <Tenant />
      },
      {
        path:"/formTenant",
        element:<TenantForm/>
      },
      {
        path: "/write",
        element: <Write />
      },
      {
        path: "/update/:id",
        element: <Write />
      }
    ]
  }
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    //Le token de l'utilisateur deja connecter est stocker dans le localStorage su navigateur
    const token = localStorage.getItem("token");

    if (token) {
      //Ajouter automatiquement le token dans le header Authorization
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      //Action Redux qui recupere le profil utilisateur deja connecter
      dispatch(account());
    }
  }, [dispatch])
  return <RouterProvider router={router} />
}

export default App;