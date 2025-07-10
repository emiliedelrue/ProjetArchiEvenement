import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [newReservation, setNewReservation] = useState({ id: '', userId: '', ticketId: '', reservationDate: '' });
    const [showForm, setShowForm] = useState(false); 

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/api/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des réservations", error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleAddReservation = async () => {
        try {
            await axios.post('/api/reservations', newReservation);
            fetchReservations(); // Recharger les réservations
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réservation", error);
        }
    };

    const handleUpdateReservation = async () => {
        try {
            await axios.put(`/api/reservations/${newReservation.id}`, newReservation);
            fetchReservations(); // Recharger les réservations
            resetForm();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la réservation", error);
        }
    };

    const handleDeleteReservation = async (id) => {
        try {
            await axios.delete(`/api/reservations/${id}`);
            fetchReservations(); // Recharger les réservations
        } catch (error) {
            console.error("Erreur lors de la suppression de la réservation", error);
        }
    };

    const handleEditClick = (reservation) => {
        setNewReservation(reservation); // Préparer le formulaire pour modifier
        setShowForm(true);
    };

    const resetForm = () => {
        setNewReservation({ id: '', userId: '', ticketId: '', reservationDate: '' });
        setShowForm(false);
    };

    return (
        <div>
            <h1>Réservations</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cacher le formulaire' : 'Créer une nouvelle réservation'}
            </button>
            {showForm && (
                <div>
                    <input 
                        type="text" 
                        placeholder="ID Utilisateur" 
                        value={newReservation.userId} 
                        onChange={(e) => setNewReservation({ ...newReservation, userId: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="ID Ticket" 
                        value={newReservation.ticketId} 
                        onChange={(e) => setNewReservation({ ...newReservation, ticketId: e.target.value })} 
                    />
                    <input 
                        type="date" 
                        value={newReservation.reservationDate} 
                        onChange={(e) => setNewReservation({ ...newReservation, reservationDate: e.target.value })} 
                    />
                    <button onClick={newReservation.id ? handleUpdateReservation : handleAddReservation}>
                        {newReservation.id ? 'Modifier Réservation' : 'Ajouter Réservation'}
                    </button>
                </div>
            )}
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>
                        {reservation.userId} a réservé {reservation.ticketId} le {reservation.reservationDate}
                        <button onClick={() => handleEditClick(reservation)}>Modifier</button>
                        <button onClick={() => handleDeleteReservation(reservation.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reservations;
