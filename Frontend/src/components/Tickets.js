import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Tickets = () => {
    const { eventId } = useParams();
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ id: '', price: '', quantity: '' });
    const [showForm, setShowForm] = useState(false);

    // Fonction pour récupérer les tickets
    const fetchTickets = async () => {
        try {
            const response = await axios.get(`/api/tickets?eventId=${eventId}`);
            setTickets(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des tickets", error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [eventId]);

    const handleAddTicket = async () => {
        try {
            await axios.post('/api/tickets', { ...newTicket, eventId });
            fetchTickets(); // Recharger les tickets
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'ajout du ticket", error);
        }
    };

    const handleUpdateTicket = async () => {
        try {
            await axios.put(`/api/tickets/${newTicket.id}`, { ...newTicket, eventId });
            fetchTickets(); // Recharger les tickets
            resetForm();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du ticket", error);
        }
    };

    const handleDeleteTicket = async (id) => {
        try {
            await axios.delete(`/api/tickets/${id}`);
            fetchTickets(); // Recharger les tickets
        } catch (error) {
            console.error("Erreur lors de la suppression du ticket", error);
        }
    };

    const handleEditClick = (ticket) => {
        setNewTicket(ticket); // Prépare le formulaire pour modification
        setShowForm(true);
    };

    const resetForm = () => {
        setNewTicket({ id: '', price: '', quantity: '' });
        setShowForm(false);
    };

    return (
        <div>
            <h1>Tickets</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cacher le formulaire' : 'Créer un nouveau ticket'}
            </button>
            {showForm && (
                <div>
                    <input 
                        type="number" 
                        placeholder="Prix" 
                        value={newTicket.price} 
                        onChange={(e) => setNewTicket({ ...newTicket, price: e.target.value })} 
                    />
                    <input 
                        type="number" 
                        placeholder="Quantité" 
                        value={newTicket.quantity} 
                        onChange={(e) => setNewTicket({ ...newTicket, quantity: e.target.value })} 
                    />
                    <button onClick={newTicket.id ? handleUpdateTicket : handleAddTicket}>
                        {newTicket.id ? 'Modifier Ticket' : 'Ajouter Ticket'}
                    </button>
                </div>
            )}
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket.id}>
                        {ticket.price} € - Quantité: {ticket.quantity}
                        <button onClick={() => handleEditClick(ticket)}>Modifier</button>
                        <button onClick={() => handleDeleteTicket(ticket.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tickets;
