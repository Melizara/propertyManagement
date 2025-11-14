import { useState, useEffect } from "react";
import LandForm from "../forms/LandForm.tsx";
import axios from "../../axios.tsx";
import LandModal from "../infos/Land.tsx";

interface Terrain {
    codeLand: number;
    name: string;
    length: number; // en m
    width: number;  // en m
    startPk: number; // en km
    position: number;
    railwaySide: "gauche" | "droite";
    available: boolean;
    userMatricule: string;
}

function HomeLand() {
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);


    const lengthKm = 163;
    const pixelsPerKm = 1512; // 25 m = 1 cm
    const svgWidth = lengthKm * pixelsPerKm;

    // Simulation de récupération des terrains depuis la DB
    useEffect(() => {
        axios.get("/api/lands")
            .then(res => setTerrains(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const container = document.getElementById("svg-container");
        if (container) {
            container.scrollTop = (1000 - container.clientHeight) / 2; // svgHeight - hauteur visible
        }
    }, []);


    const svgHeight = 1000; // la nouvelle hauteur
    const centerY = svgHeight / 2;


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
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                        <LandForm onSuccess={() => setShowModal(false)} />
                    </div>
                </div>
            )}

            <h2>Carte des terrains le long de la FCE (25 m = 1 cm)</h2>

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

                <svg
                    width={svgWidth}
                    height={1000}    // ← plus d’espace pour les terrains
                    style={{ display: "block" }}
                >
                    {/* Ligne ferroviaire */}
                    <line
                        x1={0}
                        y1={centerY}
                        x2={svgWidth}
                        y2={centerY}
                        stroke="#444"
                        strokeWidth={6}
                        strokeLinecap="round"
                    />

                    {/* Repères tous les 0.025 km (25 m) */}
                    {[...Array(Math.floor(lengthKm * 40) + 1)].map((_, i) => {
                        const x = i * 0.025 * pixelsPerKm;
                        return (
                            <line
                                key={i}
                                x1={x}
                                y1={centerY - 5}
                                x2={x}
                                y2={centerY + 5}
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
                                    x1={x}
                                    y1={centerY - 10}
                                    x2={x}
                                    y2={centerY + 10}
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

                    {/* Terrains */}
                    {terrains.map((t) => {
                        const x = t.startPk * pixelsPerKm;
                        const width = (t.length / 1000) * pixelsPerKm; // m → km → pixels
                        // tu peux adapter le scale si nécessaire // espace vertical entre plan 1 et plan 2

                        const spacingBetweenPlans = 9; // espace entre plans
                        const height = t.width; // ou adapte le scale si nécessaire

                        let y;
                        if (t.railwaySide === "gauche") {
                            y = centerY - 10 - height - (t.position - 1) * (height + spacingBetweenPlans);
                        } else {
                            y = centerY + 10 + (t.position - 1) * (height + spacingBetweenPlans);
                        }

                        const color = t.available ? "#3cb371" : "#e74c3c";

                        return (
                            <g key={t.codeLand}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={color}
                                    stroke="#222"
                                    strokeWidth={1.5}
                                    rx={4}
                                    ry={4}
                                    style={{
                                        cursor: "pointer",
                                        transition: "transform 0.6s ease", // ← animation douce
                                    }}
                                    onClick={() => setSelectedTerrain(t)}

                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                />
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

            <LandModal land={selectedTerrain} onClose={() => setSelectedTerrain(null)} />


            {/* Légende */}
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
