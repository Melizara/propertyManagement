import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../apps/Store.tsx";
import { deleteLand } from "../../features/landSlice.tsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Pencil, Trash2, Info } from "lucide-react";

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
  onDelete: (codeLand: number) => void;
}

interface User {
  matricule: string;
  pseudo: string;
  email: string;
  poste: "operateur de saisie" | "admin" | "caissier";
}

const LandModal: React.FC<LandModalProps> = ({ land, onClose, onDelete }) => {
  const user = useSelector((state: RootState) => state.auth.data) as User | null;
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (codeLand: number) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez supprimer ce terrain !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
      reverseButtons: false,
      focusCancel: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteLand(codeLand));
        onDelete(codeLand);
        onClose();
        toast.success("Terrain supprimé avec succès !");
      }
    });
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
        padding: "10px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "25px",
          borderRadius: "12px",
          width: "400px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            fontSize: "1.2rem",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          ✕
        </button>

        <div className="text-center mb-3">
          <Info size={30} className="text-primary mb-2" />
          <h4 className="fw-bold">{land.name}</h4>
          <p className="text-muted mb-3">Détails du terrain</p>
        </div>

        <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
          <p><strong>Côté:</strong> {land.railwaySide}</p>
          <p><strong>Disponible:</strong> {land.available ? "Oui ✅" : "Non ❌"}</p>
          <p><strong>Code:</strong> {land.codeLand}</p>
          <p><strong>Longueur:</strong> {land.length} m</p>
          <p><strong>Largeur:</strong> {land.width} m</p>
          <p><strong>Position:</strong> {land.position}</p>
          <p><strong>Début PK:</strong> {land.startPk} km</p>
        </div>

        {user && user.poste === "admin" && user.matricule === land.userMatricule && (
          <div className="d-flex justify-content-center mt-4 gap-3">
            <Link
              to={`/updateLand/${land.codeLand}`}
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
            >
              <Pencil size={18} /> Modifier
            </Link>
            <button
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={() => handleDelete(land.codeLand)}
            >
              <Trash2 size={18} /> Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandModal;
