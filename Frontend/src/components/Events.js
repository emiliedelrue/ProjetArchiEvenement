import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newEvent, setNewEvent] = useState({ id: '', name: '', date: '', location: '' });  // Ajouter location ici
    const [showForm, setShowForm] = useState(false);

    // Récupérer les événements depuis l'API
    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/evenements');
            setEvents(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des événements", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAdmin(decoded.role === 'Administrateur');
            } catch (error) {
                console.error("Erreur lors du décodage du token", error);
            }
        }

        fetchEvents();
    }, []);

    // Ajouter un nouvel événement
    const handleAddEvent = async () => {
        try {
            await axios.post('/api/evenements', newEvent);
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'événement", error);
        }
    };

    // Mettre à jour un événement
    const handleUpdateEvent = async () => {
        try {
            await axios.put(`/api/evenements/${newEvent.id}`, newEvent);
            resetForm();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'événement", error);
        }
    };

    // Supprimer un événement
    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`/api/evenements/${id}`);
            fetchEvents();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement", error);
        }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
        fetchEvents(); // Recharger les événements
        setNewEvent({ id: '', name: '', date: '', location: '' }); // Réinitialiser location
        setShowForm(false);
    };

    // Préparer l'événement pour modification
    const handleEditClick = (event) => {
        setNewEvent({ id: event.id, name: event.name, date: event.date, location: event.location }); // Inclure location
        setShowForm(true);
    };

    return (
        <div>
            <h1>Événements</h1>
            <div>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cacher le formulaire' : 'Créer ou modifier un événement'}
                </button>
                {showForm && (
                    <div>
                        <input
                            type="text"
                            placeholder="Nom de l'événement"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Lieu de l'événement"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        />
                        <button onClick={newEvent.id ? handleUpdateEvent : handleAddEvent}>
                            {newEvent.id ? 'Modifier Événement' : 'Ajouter Événement'}
                        </button>
                    </div>
                )}
            </div>
            <h2>Liste des Événements</h2>
            {events.length === 0 ? (
                <p>Aucun événement trouvé.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            {event.name} - {event.date} - {event.location}  {/* Afficher le lieu */}
                            {isAdmin && (
                                <div>
                                    <button onClick={() => handleEditClick(event)}>Modifier</button>
                                    <button onClick={() => handleDeleteEvent(event.id)}>Supprimer</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Events;
