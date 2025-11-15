import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../apps/Store.tsx";
import React from "react";

interface Props {
  children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
  const user = useSelector((state: RootState) => state.auth.data);

  // Vérifie aussi le token dans le localStorage
  const token = localStorage.getItem("token");

  // Si pas d'utilisateur ET pas de token, redirige vers login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Sinon affiche la page
  return <>{children}</>;
}

export default PrivateRoute;
