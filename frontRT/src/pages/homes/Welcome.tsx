// Importation des hooks React Router
import { useNavigate } from 'react-router-dom'; 

// Importation des icônes Lucide spécifiques
import { Home as HomeIcon, Users, MapPin, ReceiptText, ArrowRight } from 'lucide-react';

function Welcome() {
    // Initiadlisation du hook de navigation
    const navigate = useNavigate();

    // Fonction de gestion du clic pour la redirection
    const handleStartClick = () => {
        // Redirige vers la route /login
        navigate('/login');
    };

    // Données pour les fonctionnalités, utilisant des composants d'icônes Lucide
    const features = [
        {
            title: "Gestion des Locataires",
            description: "Ajoutez, modifiez et suivez vos locataires facilement.",
            Icon: Users // Icône Lucide pour les utilisateurs
        },
        {
            title: "Suivi des Terrains et Propriétés",
            description: "Visualisez les terrains, leurs superficies et usages en un coup d'œil.",
            Icon: MapPin // Icône Lucide pour la localisation/carte
        },
        {
            title: "Facturation Automatique",
            description: "Générez des factures et reçus automatiquement, prêts à être exportés en PDF.",
            Icon: ReceiptText // Icône Lucide pour la facturation
        },
    ];

    return (
        // Utilisation des classes Bootstrap pour le style et la mise en page
        <div className="min-vh-80">
            {/* 1. Section Hero - Tête de page moderne et impactante */}
            <header className="bg-white py-5 py-md-6 text-center shadow-sm">
                <div className="container px-4 px-lg-5">
                    <div className="d-flex justify-content-center mb-4">
                        {/* Les icônes Lucide sont stylisées avec des classes de texte Bootstrap */}
                        <HomeIcon className="text-primary" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    <h1 className="display-3 fw-bolder text-dark mb-3">
                        Propriétés, simplifiées.
                    </h1>
                    <p className="lead text-muted mb-5">
                        Gérez facilement vos biens, locataires et finances avec la plateforme **Property Management**, conçue pour la rapidité et l'efficacité.
                    </p>
                    
                    {/* Bouton d'Action Principal */}
                    <button 
                        className="btn btn-primary btn-lg px-5 py-3 shadow-lg rounded-pill"
                        onClick={handleStartClick}
                    >
                        C'est parti !
                        <ArrowRight className="ms-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                </div>
            </header>

            {/* 2. Section Fonctionnalités - Mise en page en grille */}
            <section className="py-5 py-lg-6">
                <div className="container px-4 px-lg-5">
                    <h2 className="text-center display-5 fw-bold text-dark mb-5">
                        🚀 Fonctionnalités Clés
                    </h2>
                    
                    <div className="row g-4 justify-content-center">
                        {features.map((feature, index) => (
                            <div className="col-md-6 col-lg-4" key={index}>
                                {/* Carte de fonctionnalité stylée avec ombre et bordures arrondies */}
                                <div className="card h-100 p-4 border-0 rounded-3 shadow-lg text-center">
                                    {/* Conteneur de l'icône */}
                                    <div className="mx-auto p-3 mb-4 d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary">
                                        <feature.Icon style={{ width: '2rem', height: '2rem' }} />
                                    </div>
                                    
                                    <h3 className="h5 fw-bold text-dark mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-secondary">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Welcome;