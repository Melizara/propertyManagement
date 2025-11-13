//Outlet est une zone ou le contenu des pages enfants s'affichent
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import HomeTenant from "./pages/homes/HomeTenant.tsx";
import Story from "./pages/infos/Story.tsx";
import Tenant from "./pages/infos/Tenant.tsx";
import Write from "./pages/forms/Write";
import TenantForm from "./pages/forms/TenantForm.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";//useDispatch permet d'envoyer une action Redux
import type { AppDispatch } from "./apps/Store.tsx";//AppDispatch sert a typer le dispatch avec typescript
import axios from "./axios";//Tsy mila manoratra anle localhost:5000 iny tsony fa efa ato zay
import { account } from "./features/authSlice";//Action Redux pour recuperer les informations de l'user connectee
import Welcome from "./pages/homes/Welcome.tsx";
import PrivateRoute from "./reducerComponent/PrivateRoute.tsx";
import HomeStory from "./pages/homes/HomeStory.tsx";
import HomeLand from "./pages/homes/HomeLand.tsx";

//Layout est un modele de page commun,Outlet change selon la route
const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


//Creation de toute les routes
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Welcome />
      },
      {
        path: "/story",
        element: (
          <PrivateRoute>
            <HomeStory />
          </PrivateRoute>
        )
      },
      {
        path: "/locataire",
        element: (
          <PrivateRoute>
            <HomeTenant />
          </PrivateRoute>
        )
      },
      {
        path:"/terrain",
        element:(
          <PrivateRoute>
            <HomeLand/>
          </PrivateRoute>
        )
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
        path: "/tenant/:cin",
        element: <Tenant />
      },
      {
        path: "/write",
        element: <Write />
      },
      {
        path: "/formTenant",
        element: <TenantForm />
      },
      {
        path: "/update/:id",
        element: <Write />
      },
      {
        path: "/updateTenant/:cin",
        element: <TenantForm />
      }
    ]
  }
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    //Le token de l'utilisateur deja connecter est stocker dans le localStorage sur navigateur
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