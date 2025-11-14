import { useState } from "react";
import LandForm from "../forms/LandForm.tsx";

const initialTerrains = [
    { id: 1, name: "Terrain A", pkFCE: 10, available: true, side: "left" },
    { id: 2, name: "Terrain B", pkFCE: 25, available: false, side: "right" },
    { id: 3, name: "Terrain C", pkFCE: 70, available: true, side: "left" },
    { id: 4, name: "Terrain D", pkFCE: 120, available: false, side: "right" },
    { id: 5, name: "Terrain E", pkFCE: 145, available: true, side: "left" },
];

function HomeLand() {
    const [terrains] = useState(initialTerrains);
    const [showModal, setShowModal] = useState(false);
    const lengthKm = 163;
    const pixelsPerKm = 378; // 0,1 km = 1 cm → 1 km = 10 cm ≈ 378 px
    const svgWidth = lengthKm * pixelsPerKm; // 163*378 ≈ 61614 px


    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowModal(true)}
            >
                Ajouter un Terrain
            </button>

            {/* Modale */}
            {showModal && (
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
                        animation: "fadeIn 0.3s ease-out",
                    }}
                    onClick={() => setShowModal(false)}
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
                        onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique à l'intérieur
                    >
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
                        <LandForm onSuccess={() => setShowModal(false)} />
                    </div>
                </div>
            )}
            <h2>Carte des terrains le long de la FCE (100 m = 1 cm)</h2>

            {/* Conteneur scrollable uniquement pour la carte */}
            <div
                style={{
                    width: "90vw", // largeur visible
                    maxWidth: "100%",
                    overflowX: "auto", // scroll horizontal seulement
                    overflowY: "hidden", // pas de scroll vertical
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    whiteSpace: "nowrap", // évite les retours à la ligne
                }}
            >
                <svg
                    width={svgWidth}
                    height={300}
                    style={{
                        display: "block",
                    }}
                >
                    {/* Ligne ferroviaire */}
                    <line
                        x1={0}
                        y1={150}
                        x2={svgWidth}
                        y2={150}
                        stroke="#444"
                        strokeWidth={6}
                        strokeLinecap="round"
                    />
                    {[...Array(Math.floor(lengthKm * 10) + 1)].map((_, i) => {
                        const x = i * 0.1 * pixelsPerKm; // 0,1 km = 100 m
                        return (
                            <line
                                key={i}
                                x1={x}
                                y1={145}
                                x2={x}
                                y2={155}
                                stroke="#161515ff"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Repères de distance tous les 20 km */}
                    {/* Repères tous les 1 km */}
                    {[...Array(lengthKm + 1)].map((_, i) => {
                        const x = i * pixelsPerKm; // 1 km = pixelsPerKm
                        return (
                            <g key={i}>
                                <line
                                    x1={x}
                                    y1={140}
                                    x2={x}
                                    y2={160}
                                    stroke="#555"
                                    strokeWidth={2}
                                />
                                <text
                                    x={x}
                                    y={130}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fill="#333"
                                >
                                    {i} km
                                </text>
                            </g>
                        );
                    })}


                    {/* Terrains */}
                    {terrains.map((t) => {
                        const x = t.pkFCE * pixelsPerKm - 20;
                        const y = t.side === "left" ? 80 : 160;
                        const color = t.available ? "#3cb371" : "#e74c3c";

                        return (
                            <g key={t.id}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={40}
                                    height={40}
                                    fill={color}
                                    stroke="#222"
                                    strokeWidth={1.5}
                                    rx={4}
                                    ry={4}
                                    style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                    onClick={() =>
                                        alert(
                                            `Terrain: ${t.name}\nCôté: ${t.side}\nDisponible: ${t.available ? "Oui" : "Non"
                                            }`
                                        )
                                    }
                                    onMouseEnter={(e) =>
                                        e.currentTarget.setAttribute("transform", "scale(1.2)")
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget.removeAttribute("transform")
                                    }
                                />
                                <text
                                    x={x + 20}
                                    y={t.side === "left" ? y - 5 : y + 60}
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

            {/* Légende (reste fixe) */}
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

export default HomeLand;
