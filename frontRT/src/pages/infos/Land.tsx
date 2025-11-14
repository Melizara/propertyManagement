import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import { useNavigate } from "react-router-dom";
import { deleteLand } from "../../features/landSlice.tsx";


interface Land {
  codeLand: number;
  name: string;
  length: number;
  width: number;
  startPk: number;
  position: number;
  railwaySide: "gauche" | "droite";
  available: boolean;
  userMatricule: string;
  user?: {
    pseudo: string;
    email: string;
  };
}

interface LandModalProps {
  land: Land | null;
  onClose: () => void;
}
interface User {
  matricule: string;
  pseudo: string;
  email: string;
  poste: "operateur de saisie" | "admin" | "caissier";
}

const LandModal: React.FC<LandModalProps> = ({ land, onClose }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.data) as User | null;
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (codeLand: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce locataire ?")) {
      await dispatch(deleteLand(codeLand));
      navigate("/locataire");
    }
  };

  if (!land) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            float: "right",
            fontSize: "1.2rem",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          ✕
        </button>

        <h3>{land.name}</h3>
        <p><strong>Côté:</strong> {land.railwaySide}</p>
        <p><strong>Disponible:</strong> {land.available ? "Oui" : "Non"}</p>
        <p><strong>Code:</strong> {land.codeLand}</p>
        <p><strong>Longueur:</strong> {land.length} m</p>
        <p><strong>Largeur:</strong> {land.width} m</p>
        <p><strong>Position:</strong> {land.position}</p>
        <p><strong>Début PK:</strong> {land.startPk} km</p>
        {user && user.matricule === land.userMatricule && (
          <div className="d-flex justify-content-center mt-4">
            <Link to={`/updateLand/${land.codeLand}`}>
              <button className="btn btn-outline-secondary me-2">Modifier</button>
            </Link>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleDelete(land.codeLand)}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default LandModal;
