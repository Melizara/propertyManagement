function Welcome() {
    return (
        <div className="container-lg my-5">
            <div className="row align-items-center justify-content-center">
                <div className="col-md-8 text-center p-5 shadow-lg rounded-4 bg-light">
                    <h1 className="fw-bold text-primary mb-3">Bienvenue 👋</h1>
                    <p className="text-secondary fs-5">
                        Heureux de vous revoir sur notre plateforme !  
                        Explorez, gérez et profitez de toutes les fonctionnalités disponibles.
                    </p>
                    <button className="btn btn-primary btn-lg mt-4 px-4">
                        Commencer maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
