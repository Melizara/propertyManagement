// Import des hooks React et d'autres composants nécessaires
import { useState, useEffect } from "react";
import LandForm from "../forms/LandForm.tsx"; // Formulaire pour ajouter un terrain
import axios from "../../axios.tsx"; // Instance axios pour faire des requêtes HTTP
import LandModal from "../infos/Land.tsx"; // Composant modal pour afficher les infos d'un terrain
import { useSelector } from "react-redux";
import type { RootState } from "../../apps/Store.tsx";
import { Link } from "react-router-dom";
// Définition du type Land pour TypeScript
interface Land {
    codeLand: number; // identifiant unique du terrain
    name: string;     // nom du terrain
    length: number;   // longueur du terrain en mètres
    width: number;    // largeur du terrain en mètres
    startPk: number;  // point de départ du terrain en km
    position: number; // position verticale pour empiler les terrains
    railwaySide: "gauche" | "droite"; // côté du rail où se trouve le terrain
    available: boolean; // si le terrain est disponible (true) ou loué (false)
    userMatricule: string; // matricule de l'utilisateur associé au terrain
}

// Définition du composant principal HomeLand
function HomeLand() {
    const user = useSelector((state: RootState) => state.auth.data);
    // State pour stocker la liste des terrains
    const [lands, setLands] = useState<Land[]>([]);
    // State pour contrôler l'affichage du modal d'ajout de terrain
    const [showModal, setShowModal] = useState(false);
    // State pour stocker le terrain sélectionné lorsqu'on clique dessus
    const [selectedTerrain, setSelectedTerrain] = useState<Land | null>(null);

    // Configuration de l'affichage de la carte
    const lengthKm = 163; // longueur totale de la ligne ferroviaire en km
    const pixelsPerKm = 1512; // conversion km -> pixels (25 m = 1 cm)
    const svgWidth = lengthKm * pixelsPerKm; // largeur du SVG
    const svgHeight = 1000; // hauteur du SVG
    const centerY = svgHeight / 2; // coordonnée Y du rail central

    // useEffect pour récupérer les terrains depuis l'API une seule fois au chargement
    useEffect(() => {
        axios.get("/api/lands") // requête GET sur l'endpoint /api/lands
            .then(res => setLands(res.data)) // on met à jour le state avec les terrains reçus
            .catch(err => console.error(err)); // en cas d'erreur, on l'affiche dans la console
    }, []);

    // useEffect pour scroller automatiquement au centre vertical du conteneur
    useEffect(() => {
        const container = document.getElementById("svg-container"); // on récupère le conteneur SVG
        if (container) {
            // on scroll pour centrer la ligne ferroviaire
            container.scrollTop = (1000 - container.clientHeight) / 2;
        }
    }, []);

    // Calcul des décalages horizontaux pour empiler les terrains côte à côte
    const landsWithX = (() => {
        const offsets: Record<string, number> = {}; // dictionnaire pour stocker les décalages par côté et startPk
        // Tri des terrains par startPk puis par codeLand pour garantir un ordre correct
        const sortedLands = [...lands].sort((a, b) => a.startPk - b.startPk || a.codeLand - b.codeLand);

        return sortedLands.map(t => {
            const key = `${t.railwaySide}-${t.startPk}`; // clé unique pour ce côté et ce point
            if (!offsets[key]) offsets[key] = 0; // si pas encore initialisé, on met 0

            const xOffset = offsets[key]; // décalage horizontal pour ce terrain
            const widthPx = (t.length / 1000) * pixelsPerKm; // largeur du terrain en pixels
            offsets[key] += widthPx; // on augmente le décalage pour le prochain terrain

            return {
                ...t, // on garde toutes les propriétés existantes
                xOffset // on ajoute la propriété xOffset calculée
            };
        });
    })();

    // Début du rendu du composant
    return (
       <div className="container-lg" style={{ marginTop: "-65px" }}>

            <nav aria-label="breadcrumb">
                <ol className="breadcrumb" style={{ backgroundColor: "#f8f9fa", padding: "10px 15px", borderRadius: "5px" }}>
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Terrains</li>
                </ol>
            </nav>

            {/* Bouton pour ouvrir le modal d'ajout */}
            {user && user.poste === "admin" && (
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowModal(true)}
                >
                    Ajouter un Terrain
                </button>
            )}
            {/* Modal pour ajouter un terrain */}
            {showModal && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0,
                        width: "100vw", height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        zIndex: 1000,
                        animation: "fadeIn 0.3s ease-out",
                    }}
                    onClick={() => setShowModal(false)} // clic en dehors ferme le modal
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "80%",
                            maxWidth: "600px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique dedans
                    >
                        {/* Bouton de fermeture X */}
                        <button
                            style={{
                                float: "right",
                                fontSize: "1.2rem",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>

                        {/* Formulaire pour ajouter un terrain */}
                        <LandForm
                            onSuccess={async () => {
                                setShowModal(false); // on ferme le modal
                                const res = await axios.get("/api/lands"); // on recharge la liste des terrains
                                setLands(res.data);
                            }}
                            isModal={true}
                        />
                    </div>
                </div>
            )}

            {/* Titre de la carte */}
            <h2>Carte des terrains le long de la FCE (25 m = 1 cm)</h2>

            {/* Conteneur scrollable pour le SVG */}
            <div
                id="svg-container"
                style={{
                    width: "68vw",
                    height: "650px",
                    overflow: "auto",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    whiteSpace: "nowrap",
                }}
            >
                <svg width={svgWidth} height={svgHeight} style={{ display: "block" }}>
                    {/* Ligne ferroviaire centrale */}
                    <line
                        x1={0}
                        y1={centerY}
                        x2={svgWidth}
                        y2={centerY}
                        stroke="#444"
                        strokeWidth={6}
                        strokeLinecap="round"
                    />

                    {/* Petits repères tous les 25 m (0.025 km) */}
                    {[...Array(Math.floor(lengthKm * 40) + 1)].map((_, i) => {
                        const x = i * 0.025 * pixelsPerKm;
                        return (
                            <line
                                key={i}
                                x1={x} y1={centerY - 5} x2={x} y2={centerY + 5}
                                stroke="#161515ff"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Repères tous les 1 km */}
                    {[...Array(lengthKm + 1)].map((_, i) => {
                        const x = i * pixelsPerKm;
                        return (
                            <g key={i}>
                                <line
                                    x1={x} y1={centerY - 10} x2={x} y2={centerY + 10}
                                    stroke="#555"
                                    strokeWidth={2}
                                />
                                <text
                                    x={x}
                                    y={centerY - 15}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fill="#333"
                                >
                                    {i} km
                                </text>
                            </g>
                        );
                    })}

                    {/* Affichage des terrains */}
                    {landsWithX.map((t) => {
                        const x = t.startPk * pixelsPerKm + t.xOffset; // position X du terrain
                        const width = (t.length / 1000) * pixelsPerKm; // largeur du terrain
                        const spacingBetweenPlans = 9; // espacement vertical entre terrains
                        const height = t.width; // hauteur = largeur du terrain en m

                        // Calcul Y selon le côté du rail et position verticale
                        let y;
                        if (t.railwaySide === "gauche") {
                            y = centerY - 10 - height - (t.position - 1) * (height + spacingBetweenPlans);
                        } else {
                            y = centerY + 10 + (t.position - 1) * (height + spacingBetweenPlans);
                        }

                        const color = t.available ? "#3cb371" : "#e74c3c"; // vert = dispo, rouge = loué

                        return (
                            <g key={t.codeLand}>
                                {/* Rectangle représentant le terrain */}
                                <rect
                                    x={x} y={y} width={width} height={height}
                                    fill={color}
                                    stroke="#222"
                                    strokeWidth={1.5}
                                    rx={4} ry={4} // coins arrondis
                                    style={{
                                        cursor: "pointer",
                                        transition: "transform 0.6s ease",
                                    }}
                                    onClick={() => setSelectedTerrain(t)} // click ouvre le modal info
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }} // hover effet zoom
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }} // hover out
                                />
                                {/* Nom du terrain */}
                                <text
                                    x={x + width / 2}
                                    y={t.railwaySide === "gauche" ? y - 5 : y + height + 15}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fill="#333"
                                >
                                    {t.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Modal pour afficher les détails d'un terrain sélectionné */}
            <LandModal
                land={selectedTerrain}
                onClose={() => setSelectedTerrain(null)} // fermer le modal
                onDelete={(codeLand) => setLands(lands.filter(l => l.codeLand !== codeLand))} // suppression du terrain
            />

            {/* Légende des couleurs */}
            <div style={{ marginTop: "10px", display: "flex", gap: "20px" }}>
                <div>
                    <span
                        style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#3cb371",
                            marginRight: "6px",
                            border: "1px solid #222",
                        }}
                    ></span>
                    Disponible
                </div>
                <div>
                    <span
                        style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#e74c3c",
                            marginRight: "6px",
                            border: "1px solid #222",
                        }}
                    ></span>
                    Loué
                </div>
            </div>
        </div>
    );
}

// Export du composant pour pouvoir l'utiliser dans d'autres fichiers
export default HomeLand;
