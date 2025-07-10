import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../App.css'; 

function Login() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Récupère le message de succès depuis la navigation (inscription réussie)
    React.useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la connexion');
            }

            localStorage.setItem('token', data.token);
            navigate('/events');
            
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setError(error.message || "Une erreur est survenue lors de la connexion");
        } finally {
            setIsLoading(false);
        }
    };

    const pageWrapperStyle = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#3d3d3d', // gris foncé pour le texte
        backgroundColor: '#fff4f4', // fond très pâle
        backgroundImage: `url('/background.jpg')`, // tu peux remplacer cela par une image correspondante
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
    };

    return (
        <div className="page-wrapper" style={pageWrapperStyle}>
            {/* Message d'erreur */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>OK</button>
                </div>
            )}

            {/* Message de succès */}
            {successMessage && (
                <div className="success-message">
                    <p>{successMessage}</p>
                    <button onClick={() => setSuccessMessage(null)}>OK</button>
                </div>
            )}

            <div className="container">
                <h1 style={{ marginBottom: '10px', fontSize: '2.2rem', fontWeight: '300' }}>
                    Connexion
                </h1>
                
                <p className="description">
                    Connectez-vous pour reserver vos évènements
                </p>

                {!isLoading ? (
                    <div className="auth-form-container">
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Votre email"
                                    className="auth-input"
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Votre mot de passe"
                                    className="auth-input"
                                />
                            </div>

                            <button type="submit" className="upload-btn auth-submit-btn">
                                🔑 Se connecter
                            </button>
                        </form>

                        <div className="auth-links">
                            <p style={{ marginTop: '20px', color: '#a0c4ff' }}>
                                Pas encore de compte ?{' '}
                                <Link to="/register" className="auth-link">
                                    Créer un compte
                                </Link>
                            </p>
                            <Link to="/forgot-password" className="auth-link forgot-link">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="description">Connexion en cours…</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
