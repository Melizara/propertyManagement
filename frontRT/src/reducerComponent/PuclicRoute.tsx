import { useSelector } from "react-redux";
import type { RootState } from "../apps/Store";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.data);
  if (user) {
    if (user.poste === "admin") return <Navigate to="/terrain" replace />;
    if (user.poste === "operateur de saisie") return <Navigate to="/terrain" replace />;
    if (user.poste === "caissier") return <Navigate to="/location" replace />;
  }
  return <>{children}</>;
}

export default PublicRoute;