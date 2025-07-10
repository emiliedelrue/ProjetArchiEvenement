// src/components/Events.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', date: '' });
    const [showForm, setShowForm] = useState(false); 

    useEffect(() => {
        // Vérifiez si l'utilisateur est un admin
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userRole = decoded.role;
                setIsAdmin(userRole === 'Administrateur');
            } catch (error) {
                console.error("Erreur lors du décodage du token", error);
            }
        }

        // Chargez les événements
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events');
                setEvents(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des événements", error);
            }
        };

        fetchEvents();
    }, []);

    const handleAddEvent = async () => {
        try {
            await axios.post('/api/events', newEvent);
            const response = await axios.get('/api/events');
            setEvents(response.data);
            setNewEvent({ name: '', date: '' });
            setShowForm(false); // Cacher le formulaire après ajout
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'événement", error);
        }
    };

    return (
        <div>
            <h1>Événements</h1>
            {isAdmin && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cacher le formulaire' : 'Créer un nouvel événement'}
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
                            <button onClick={handleAddEvent}>Ajouter Événement</button>
                        </div>
                    )}
                </div>
            )}
            <ul>
                {events.map(event => (
                    <li key={event.id}>{event.name} - {event.date}</li>
                ))}
            </ul>
        </div>
    );
};

export default Events;