// src/components/Tickets.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios';

const Tickets = () => {
    const { eventId } = useParams();
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            const response = await axios.get(`/api/tickets?eventId=${eventId}`);
            setTickets(response.data);
        };
        fetchTickets();
    }, [eventId]);

    return (
        <div>
            <h1>Tickets</h1>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket.id}>{ticket.price} € - Quantité: {ticket.quantity}</li>
                ))}
            </ul>
        </div>
    );
};

export default Tickets;
