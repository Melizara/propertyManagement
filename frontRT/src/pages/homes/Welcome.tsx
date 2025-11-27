import { useNavigate } from 'react-router-dom'; 
import { Home as HomeIcon, Users, MapPin, ReceiptText, ArrowRight } from 'lucide-react';

function Welcome() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    const features = [
        {
            title: "Gestion des Locataires",
            description: "Ajoutez, modifiez et suivez vos locataires facilement.",
            Icon: Users
        },
        {
            title: "Suivi des Terrains et Propriétés",
            description: "Visualisez les terrains, leurs superficies et usages en un coup d'œil.",
            Icon: MapPin
        },
        {
            title: "Facturation Automatique",
            description: "Générez des factures et reçus automatiquement, prêts à être exportés en PDF.",
            Icon: ReceiptText
        },
    ];

    return (
        <div className="min-vh-80">
            {/* Section Hero */}
            <header className="py-5 py-md-6 text-center shadow-sm" 
                style={{ 
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', 
                    borderBottom: '1px solid #dee2e6' 
                }}>
                <div className="container px-4 px-lg-5">
                    <div className="d-flex justify-content-center mb-4">
                        <HomeIcon className="text-primary" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    <h1 className="display-3 fw-bolder text-dark mb-3">
                        Propriétés, simplifiées.
                    </h1>
                    <p className="lead text-muted mb-5">
                        Gérez facilement vos biens, locataires et finances avec la plateforme <strong>Property Management</strong>, conçue pour la rapidité et l'efficacité.
                    </p>
                    
                    <button 
                        className="btn btn-primary btn-lg px-5 py-3 shadow-lg rounded-pill"
                        style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onClick={handleStartClick}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        C'est parti !
                        <ArrowRight className="ms-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                </div>
            </header>

            {/* Section Fonctionnalités */}
            <section className="py-5 py-lg-6">
                <div className="container px-4 px-lg-5">
                    <h2 className="text-center display-5 fw-bold text-dark mb-5">
                        🚀 Fonctionnalités Clés
                    </h2>
                    
                    <div className="row g-4 justify-content-center">
                        {features.map((feature, index) => (
                            <div className="col-md-6 col-lg-4" key={index}>
                                <div className="card h-100 p-4 border-0 rounded-4 shadow-lg text-center feature-card"
                                    style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 1rem 2rem rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,0.15)';
                                    }}
                                >
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
