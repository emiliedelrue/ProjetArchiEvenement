import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

function Register() {
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        telephone: '',
        statut: 'client' // valeur par défaut
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (registerData.password !== registerData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return false;
        }
        
        if (registerData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return false;
        }

        // Validation du téléphone (optionnel mais si rempli, doit être valide)
        if (registerData.telephone && !/^[0-9+\-\s()]{8,}$/.test(registerData.telephone)) {
            setError("Le numéro de téléphone n'est pas valide");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const { confirmPassword, ...dataToSend } = registerData;
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                navigate('/login', { 
                    state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' }
                });
            }
            
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            setError(error.message || "Une erreur est survenue lors de l'inscription");
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

            <div className="container">
                <h1 style={{ marginBottom: '10px', fontSize: '2.2rem', fontWeight: '300' }}>
                    Créer un compte
                </h1>
                
                <p className="description">
                    Rejoignez-nous et commencez à reserver vos évènements
                </p>

                {!isLoading ? (
                    <div className="auth-form-container">
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={registerData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Prénom"
                                    className="auth-input half-width"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={registerData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nom"
                                    className="auth-input half-width"
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Votre email"
                                    className="auth-input"
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={registerData.telephone}
                                    onChange={handleInputChange}
                                    placeholder="Numéro de téléphone (optionnel)"
                                    className="auth-input"
                                />
                            </div>

                            <div className="form-group">
                                <select
                                    name="statut"
                                    value={registerData.statut}
                                    onChange={handleInputChange}
                                    className="auth-input"
                                    required
                                >
                                    <option value="client">Client</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Mot de passe (min. 6 caractères)"
                                    className="auth-input"
                                    minLength="6"
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={registerData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Confirmer le mot de passe"
                                    className="auth-input"
                                />
                            </div>

                            <button type="submit" className="upload-btn auth-submit-btn">
                                👤 Créer mon compte
                            </button>
                        </form>

                        <div className="auth-links">
                            <p style={{ marginTop: '20px', color: '#a0c4ff' }}>
                                Déjà un compte ?{' '}
                                <Link to="/login" className="auth-link">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="description">Création du compte en cours…</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;
