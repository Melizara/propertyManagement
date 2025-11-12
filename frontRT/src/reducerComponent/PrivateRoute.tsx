import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../apps/Store.tsx";
import React from "react";

interface Props {
    children: React.ReactNode;
}

function PrivateRoute({ children }: Props) {
    const user = useSelector((state: RootState) => state.auth.data);
    return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;