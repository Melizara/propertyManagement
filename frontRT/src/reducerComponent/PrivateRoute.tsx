import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../apps/Store.tsx";
import React from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // 🔹 Ajout: rôles autorisés
}

function PrivateRoute({ children, allowedRoles }: Props) {
  const user = useSelector((state: RootState) => state.auth.data);

  const token = localStorage.getItem("token");

  // 🔹 Si pas connecté → redirige vers /login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Si connecté mais n'a pas le bon rôle → redirige vers /unauthorized
  if (allowedRoles && user && !allowedRoles.includes(user.poste)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 🔹 Sinon il peut accéder
  return <>{children}</>;
}

export default PrivateRoute;
